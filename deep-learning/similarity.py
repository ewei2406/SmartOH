from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

def your_similarity_function(target_string, string_list):

    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Two lists of sentences
    sentences1 = [target_string]

    sentences2 = string_list

    #Compute embedding for both lists
    embeddings1 = model.encode(sentences1, convert_to_tensor=True)
    embeddings2 = model.encode(sentences2, convert_to_tensor=True)

    #Compute cosine-similarities
    cosine_scores = util.cos_sim(embeddings1, embeddings2)
    return cosine_scores.tolist()

@app.route('/similarity', methods=['POST'])
def calculate_similarity():
    try:
        data = request.json
        target_string = data.get('target_string')
        string_list = data.get('string_list')

        if not target_string or not string_list:
            return jsonify({"error": "Both target_string and string_list must be provided"}), 400

        # Calculate similarity scores
        similarity_scores = your_similarity_function(target_string, string_list)

        return jsonify({"similarity_scores": similarity_scores})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)