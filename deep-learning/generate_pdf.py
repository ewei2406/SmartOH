import json
import os
import subprocess

import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

# Example dummy function hard coded to return the same weather
# In production, this could be your backend API or an external API

class PDFGenerator:
    
    def __init__(self, transcription):
        self.transcription = transcription

    def compile_latex(self, latex: str, save_path="data/"):
        print("You are inside the compile_latex function")
        temp_tex_path = os.path.join(save_path, "temp.tex")

        # Write the LaTeX to a temporary .tex file
        with open(f"{save_path}temp.tex", "w") as f:
            f.write(latex)
        
        try:
            subprocess.run(["pdflatex", f"{save_path}temp.tex", "-output-directory=" + save_path, ], check=True)
            # completed_process = subprocess.run(["pdflatex", "-output-directory=" + save_path, temp_tex_path], check=True, capture_output=True, text=True)

            # Move the output PDF to the desired save path
            # subprocess.run(["mv", "report.pdf", save_path], check=True)
            return {"message": "PDF compiled and saved successfully"}

        except subprocess.CalledProcessError as e:
            return {"message": "Error during LaTeX compilation", "details": str(e)}
        
        try:
            completed_process = subprocess.run(["pdflatex", "-output-directory=" + save_path, temp_tex_path], check=True, capture_output=True, text=True)
            print(completed_process.stdout)
            print(completed_process.stderr)
            
            return {"message": "PDF compiled and saved successfully"}

        except subprocess.CalledProcessError as e:
            print(f"Error output: {e.output}")
            return {"message": "Error during LaTeX compilation", "details": str(e)}
    

    def run_conversation(self):
        # Step 1: send the conversation and available functions to GPT
        messages = [{"role": "user", "content": "Your job is to take the transcript of a conversation, then summarize it and format it into a brief latex document capturing the questions and the core of the answers.  YOU MUST INCLUDE BOTH THE QUESTION AND THE ANSWER FOR EACH QUESTION THAT IS ASKED OR TOPIC THAT IS DISCUSSED. Here is the transcript. Make sure you are including the correct packages that can be run. {}".format(self.transcription)}]

        functions = [
            {
                "name": "compile_latex",
                "description": "Compile the LaTeX code into a PDF document. The PDF will be saved to a default location. This function will not understand anythign else besides Latex code.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "latex": {
                            "type": "string",
                            "description": "The LaTeX code to be compiled."
                        },
                    },
                    "required": ["latex"],
                },
            }
        ]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=messages,
            functions=functions,
            function_call="auto",  # auto is default, but we'll be explicit
        )
        response_message = response["choices"][0]["message"]

        # Step 2: check if GPT wanted to call a function
        if response_message.get("function_call"):
            # Step 3: call the function
            # Note: the JSON response may not always be valid; be sure to handle errors
            available_functions = {
                "compile_latex": self.compile_latex,
            }  # only one function in this example, but you can have multiple
            function_name = response_message["function_call"]["name"]
            fuction_to_call = available_functions[function_name]
            function_args = json.loads(response_message["function_call"]["arguments"])
            function_response = fuction_to_call(
                latex=function_args.get("latex"),
            )
            return ("PDF generated successfully")
            # print(function_response)

            # # Step 4: send the info on the function call and function response to GPT
            # messages.append(response_message)  # extend conversation with assistant's reply
            # messages.append(
            #     {
            #         "role": "function",
            #         "name": function_name,
            #         "content": function_response,
            #     }
            # )  # extend conversation with function response
            # second_response = openai.ChatCompletion.create(
            #     model="gpt-3.5-turbo-0613",
            #     messages=messages,
            # )  # get a new response from GPT where it can see the function response
            # return second_response


AI = PDFGenerator("Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking. Extra memory, usually a stack, is needed to keep track of the nodes discovered so far along a specified branch which helps in backtracking of the graph. A version of depth-first search was investigated in the 19th century by French mathematician Charles Pierre Trémaux[1] as a strategy for solving mazes.[2][3] Properties The time and space analysis of DFS differs according to its application area. In theoretical computer science, DFS is typically used to traverse an entire graph, and takes time � ( | � | + | � | ) O(|V| + |E|),[4] where | � | |V| is the number of vertices and | � | |E| the number of edges. This is linear in the size of the graph. In these applications it also uses space � ( | � | ) O(|V|) in the worst case to store the stack of vertices on the current search path as well as the set of already-visited vertices. Thus, in this setting, the time and space bounds are the same as for breadth-first search and the choice of which of these two algorithms to use depends less on their complexity and more on the different properties of the vertex orderings the two algorithms produce. For applications of DFS in relation to specific domains, such as searching for solutions in artificial intelligence or web-crawling, the graph to be traversed is often either too large to visit in its entirety or infinite (DFS may suffer from non-termination). In such cases, search is only performed to a limited depth; due to limited resources, such as memory or disk space, one typically does not use data structures to keep track of the set of all previously visited vertices. When search is performed to a limited depth, the time is still linear in terms of the number of expanded vertices and edges (although this number is not the same as the size of the entire graph because some vertices may be searched more than once and others not at all) but the space complexity of this variant of DFS is only proportional to the depth limit, and as a result, is much smaller than the space needed for searching to the same depth using breadth-first search. For such applications, DFS also lends itself much better to heuristic methods for choosing a likely-looking branch. When an appropriate depth limit is not known a priori, iterative deepening depth-first search applies DFS repeatedly with a sequence of increasing limits. In the artificial intelligence mode of analysis, with a branching factor greater than one, iterative deepening increases the running time by only a constant factor over the case in which the correct depth limit is known due to the geometric growth of the number of nodes per level. DFS may also be used to collect a sample of graph nodes. However, incomplete DFS, similarly to incomplete BFS, is biased towards nodes of high degree. Example Animated example of a depth-first search For the following graph: An undirected graph with edges AB, BD, BF, FE, AC, CG, AE a depth-first search starting at the node A, assuming that the left edges in the shown graph are chosen before right edges, and assuming the search remembers previously visited nodes and will not repeat them (since this is a small graph), will visit the nodes in the following order: A, B, D, F, E, C, G. The edges traversed in this search form a Trémaux tree, a structure with important applications in graph theory. Performing the same search without remembering previously visited nodes results in visiting the nodes in the order A, B, D, F, E, A, B, D, F, E, etc. forever, caught in the A, B, D, F, E cycle and never reaching C or G. Iterative deepening is one technique to avoid this infinite loop and would reach all nodes. Output of a depth-first search The four types of edges defined by a spanning tree The result of a depth-first search of a graph can be conveniently described in terms of a spanning tree of the vertices reached during the search. Based on this spanning tree, the edges of the original graph can be divided into three classes: forward edges, which point from a node of the tree to one of its descendants, back edges, which point from a node to one of its ancestors, and cross edges, which do neither. Sometimes tree edges, edges which belong to the spanning tree itself, are classified separately from forward edges. If the original graph is undirected then all of its edges are tree edges or back edges. Vertex orderings It is also possible to use depth-first search to linearly order the vertices of a graph or tree. There are four possible ways of doing this: A preordering is a list of the vertices in the order that they were first visited by the depth-first search algorithm. This is a compact and natural way of describing the progress of the search, as was done earlier in this article. A preordering of an expression tree is the expression in Polish notation. A postordering is a list of the vertices in the order that they were last visited by the algorithm. A postordering of an expression tree is the expression in reverse Polish notation. A reverse preordering is the reverse of a preordering, i.e. a list of the vertices in the opposite order of their first visit. Reverse preordering is not the same as postordering. A reverse postordering is the reverse of a postordering, i.e. a list of the vertices in the opposite order of their last visit. Reverse postordering is not the same as preordering. For binary trees there is additionally in-ordering and reverse in-ordering. For example, when searching the directed graph below beginning at node A, the sequence of traversals is either A B D B A C A or A C D C A B A (choosing to first visit B or C from A is up to the algorithm). Note that repeat visits in the form of backtracking to a node, to check if it has still unvisited neighbors, are included here (even if it is found to have none). Thus the possible preorderings are A B D C and A C D B, while the possible postorderings are D B C A and D C B A, and the possible reverse postorderings are A C B D and A B C D. A directed graph with edges AB, BD, AC, CD Reverse postordering produces a topological sorting of any directed acyclic graph. This ordering is also useful in control-flow analysis as it often represents a natural linearization of the control flows. The graph above might represent the flow of control in the code fragment below, and it is natural to consider this code in the order A B C D or A C B D but not natural to use the order A B D C or A C D B. if (A) then { B } else { C } D Pseudocode Input: Output: A recursive implementation of DFS:[5] procedure DFS(G, v) is label v as discovered for all directed edges from v to w that are in G.adjacentEdges(v) do if vertex w is not labeled as discovered then recursively call DFS(G, w) A non-recursive implementation of DFS with worst-case space complexity � ( | � | ) O(|E|), with the possibility of duplicate vertices on the stack:[6] procedure DFS_iterative(G, v) is let S be a stack S.push(v) while S is not empty do v = S.pop() if v is not labeled as discovered then label v as discovered for all edges from v to w in G.adjacentEdges(v) do S.push(w) An undirected graph with edges AB, BD, BF, FE, AC, CG, AE")
print(AI.run_conversation())



