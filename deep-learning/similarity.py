import nltk
import string
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('stopwords')

# Sample sentences
sentence1 = "What is DFS?"
alts = ["what is a graph", "what is djikstras"]

# Function to preprocess text
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))
    return text

base = preprocess_text(sentence1)

base_tokens = nltk.word_tokenize(base)

for sentence in alts :
    print(sentence)
    alt = preprocess_text(sentence)
    alt_tokens = nltk.word_tokenize(alt)


    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([base, alt])

    cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
    similarity_percentage = cosine_sim[0][0] * 100

    print(f"Similarity with '{sentence}'", similarity_percentage, "%")
