import sys
import json

def forward_chaining_inference(text):
    text = text.lower()
    
    # "Knowledge Base" of rules (Unit 3 Concept)
    high_value_keywords = ['wallet', 'purse', 'cash', 'money', 'laptop', 'macbook', 'phone', 'iphone', 'airpods']
    critical_doc_keywords = ['passport', 'id', 'visa', 'certificate', 'license']
    emotional_keywords = ['urgent', 'emergency', 'panic', 'please help']
    
    # Forward Chaining Logic
    urgency_level = "Low"
    reason = "Standard item."
    
    if any(word in text for word in critical_doc_keywords):
        urgency_level = "Critical"
        reason = "Contains critical official document keywords."
    elif any(word in text for word in emotional_keywords):
        urgency_level = "High"
        reason = "Detected urgency in language."
    elif any(word in text for word in high_value_keywords):
        urgency_level = "High"
        reason = "Contains high-value keywords."

    return {
        "urgencyLevel": urgency_level,
        "inferenceReason": reason
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        result = forward_chaining_inference(input_text)
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No text provided"}))
