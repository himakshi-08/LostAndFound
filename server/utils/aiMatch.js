const natural = require('natural');
const { TfIdf, LevenshteinDistance, PorterStemmer, WordTokenizer } = natural;

const tokenizer = new WordTokenizer();

const tokenizeAndStem = (text) => {
    if (!text) return [];
    return tokenizer.tokenize(text.toLowerCase())
        .filter(word => word.length > 2)
        .map(word => PorterStemmer.stem(word));
};

const calculateCosineSimilarity = (vecA, vecB) => {
    const terms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    terms.forEach(term => {
        const valA = vecA[term] || 0;
        const valB = vecB[term] || 0;
        dotProduct += valA * valB;
        magA += valA * valA;
        magB += valB * valB;
    });

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    return magA === 0 || magB === 0 ? 0 : dotProduct / (magA * magB);
};

const buildTfIdfVector = (tfidf, docIndex, vocabulary) => {
    const vector = {};
    vocabulary.forEach(term => {
        vector[term] = tfidf.tfidf(term, docIndex);
    });
    return vector;
};

const buildVocabulary = (tfidf, documentCount) => {
    const vocabulary = new Set();
    for (let i = 0; i < documentCount; i += 1) {
        tfidf.listTerms(i).forEach(({ term }) => vocabulary.add(term));
    }
    return vocabulary;
};

const findMatches = (newItem, existingItems) => {
    if (!existingItems || existingItems.length === 0) return [];

    const newDescriptionText = tokenizeAndStem(`${newItem.title} ${newItem.description}`).join(' ');
    const newLocationText = tokenizeAndStem(newItem.location).join(' ');

    const descTfIdf = new TfIdf();
    const locTfIdf = new TfIdf();

    descTfIdf.addDocument(newDescriptionText);
    locTfIdf.addDocument(newLocationText);

    existingItems.forEach(item => {
        descTfIdf.addDocument(tokenizeAndStem(`${item.title} ${item.description}`).join(' '));
        locTfIdf.addDocument(tokenizeAndStem(item.location).join(' '));
    });

    const descriptionVocabulary = buildVocabulary(descTfIdf, existingItems.length + 1);
    const locationVocabulary = buildVocabulary(locTfIdf, existingItems.length + 1);

    const newDescVector = buildTfIdfVector(descTfIdf, 0, descriptionVocabulary);
    const newLocVector = buildTfIdfVector(locTfIdf, 0, locationVocabulary);

    const matches = existingItems.map((item, index) => {
        const itemDescVector = buildTfIdfVector(descTfIdf, index + 1, descriptionVocabulary);
        const itemLocVector = buildTfIdfVector(locTfIdf, index + 1, locationVocabulary);

        const descriptionSimilarity = calculateCosineSimilarity(newDescVector, itemDescVector);
        const locationSimilarity = calculateCosineSimilarity(newLocVector, itemLocVector);

        const levDist = LevenshteinDistance(newItem.title.toLowerCase(), item.title.toLowerCase());
        const maxTitleLen = Math.max(newItem.title.length, item.title.length, 1);
        const titleSimilarity = 1 - (levDist / maxTitleLen);

        const categoryMatch = newItem.category === item.category ? 1 : 0;

        const d1 = new Date(newItem.date);
        const d2 = new Date(item.date);
        let timeDecay = 1;
        if (!Number.isNaN(d1.getTime()) && !Number.isNaN(d2.getTime())) {
            const hoursGap = Math.abs(d1 - d2) / (1000 * 60 * 60);
            timeDecay = Math.exp(-hoursGap / 72);
        }

        const score =
            (descriptionSimilarity * 35) +
            (titleSimilarity * 30) +
            (categoryMatch * 20) +
            (locationSimilarity * 10) +
            (timeDecay * 5);

        return {
            item,
            score: Math.round(score),
            aiExplanation: {
                descriptionSimilarity: Math.round(descriptionSimilarity * 100),
                fuzzyMatch: Math.round(titleSimilarity * 100),
                locationSimilarity: Math.round(locationSimilarity * 100),
                timeRelevance: Math.round(timeDecay * 100)
            }
        };
    });

    return matches
        .filter(match => match.score >= 15)
        .sort((a, b) => b.score - a.score);
};

module.exports = { findMatches };

