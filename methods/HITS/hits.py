import argparse
import networkx as nx
import numpy as np

def parse_graph(fname: str):
    G = nx.DiGraph()
    with open(fname, 'r') as f:
        data = f.readlines()
        i = None
        line = None
        vertex_link_map = {}
        try:
            for i, line in enumerate(data):
                if i == 0:
                    assert line == "digraph {\n"
                elif i == len(data) - 1:
                    assert line == "}\n"
                else:
                    link = line.split(" -> ")
                    assert len(link) == 2
                    for l in link:
                        assert len(l.lstrip().rstrip()) > 0
                    parent = link[0].lstrip().rstrip()
                    child = link[1].lstrip().rstrip()
                    G.add_edge(parent, child)
        except Exception as e:
            print(f"ERROR: {fname} is not in the right format!")
            print("ERROR: expected\ndigraph {\nA -> B\nB -> C\nC -> D\n...etc\n}")
            print(f"ERROR: failed on line number {i}; {line}")
            print(str(e))
            exit(1)
        return G

def hits(graph, max_iterations=100):
    adj_matrix = nx.adjacency_matrix(graph).toarray()
    num_nodes = len(adj_matrix)
    hubs = np.ones(num_nodes)
    authorities = np.ones(num_nodes)

    for i in range(max_iterations):
        authorities = adj_matrix.T.dot(hubs)
        authorities /= np.linalg.norm(authorities, axis=0)
        hubs = adj_matrix.dot(authorities)
        hubs /= np.linalg.norm(hubs, axis=0)

    return authorities, hubs

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input_graph", help="Input dot graph")
    parser.add_argument("output", help="Output file")
    args = parser.parse_args()

    graph = parse_graph(args.input_graph)
    a, h = hits(graph)

    highest_authority_indeces = np.argsort(a)[::-1]
    sorted_scores = np.sort(a)[::-1]

    with open(args.output, 'w') as f:
        f.write("vertex,pagerank\n")
        for rank, index in enumerate(highest_authority_indeces, start=1):
            f.write(str(list(graph.nodes())[index]) + "," + str(sorted_scores[rank-1]) + "\n")
