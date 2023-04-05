import argparse
from typing import Dict, Set, Tuple
import numpy as np

def parse_graph(fname: str) -> Tuple[Dict[str, Set[str]], Set[str]]:
    """
    Parses input file into a graph
    
    fname: str
        the file name of the input file

    returns:
        the graph and set of vertices
    
    throws:
        if the input file is not the right format the program will exit
    """
    with open(fname, 'r') as f:
        data = f.readlines()
        i = None
        line = None
        graph = {}
        vertices = set([])
        try:
            for i, line in enumerate(data):
                if i == 0:
                    # expect the first line to be the header
                    assert line == "digraph {\n"
                elif i == len(data) - 1:
                    # expect the last line to be the end brace
                    assert line == "}\n"
                else:
                    # split by the arrow and assert that there are only two items provided so that format is not lost
                    link = line.split(" -> ")
                    assert len(link) == 2
                    for l in link:
                        assert len(l.lstrip().rstrip()) > 0

                    # remote white space and new lines
                    parent = link[0].lstrip().rstrip()
                    child = link[1].lstrip().rstrip()

                    # track all vertices for size
                    vertices.add(parent)
                    vertices.add(child)

                    if parent in graph:
                        graph[parent].add(child)
                    else:
                        graph[parent] = set([child])

        except Exception as e:
            print(f"ERROR: {fname} is not in the right format!")
            print("ERROR: expected\ndigraph {\nA -> B\nB -> C\nC -> D\n...etc\n}")
            print(f"ERROR: failed on line number {i}; {line}")
            print(str(e))
            exit(1)

        return graph, vertices

def write_results(out: str, ranks: Dict[str, float]) -> None:
    """
    Writes the results to a .csv file

    out: str
        The file name for output

    ranks: np.ndarray
        The np.ndarray of the ranks to store

    returns: none
    """
    with open(out, "+w") as f:
        f.write("vertex,pagerank\n")
        for vertex, page_rank in sorted(ranks.items(), key=lambda item: (-item[1], item[0])):
            f.write(f"{vertex},{page_rank}\n")

def rank(graph: Dict[str, Set[str]], vertices: Set[str], beta: float = 0.8, e: float = 0.001) -> Dict[str, float]:
    """
    Creates the ranks for all the graphs

    graph: Dict[str, Set[str]]
        The graph provided by parse_graph()

    vertices: Set[str]
        A set of all the vertices in the graph

    beta: float
        The probability of teleportation

    e: float
        The maximum error allowed before we consider convergence

    returns: Dict[str, float]
        Rank values computed using the Google Matrix Power Method
    """
    size = len(vertices)

    # convert graph to array form for simpler matrix operations
    # need to store table of id's from graph -> matrix and back
    idx = {vertex: i for i, vertex in enumerate(vertices)}
    idx_to_vertex = {i: parent for parent, i in idx.items()}

    # N matrix
    N = np.full((size, size), 1 / size)

    # M matrix
    M = np.zeros((size, size))

    # initialize ranks to 1/n
    ranks = np.full(size, 1 / size).T

    # compute M matrix
    for i, parent in enumerate(vertices):
        children = graph.get(parent, [])
        if len(children) == 0: 
            # we are a dead end
            for other in vertices:
                # set the probability to all vertices to be the same -- teleport
                i = idx[parent]
                j = idx[other]

                M[j, i] = 1 / size 
        else:
            for child in children:
                i = idx[parent]
                j = idx[child]
                M[j, i] = 1 / len(children)

    # construct A matrix using beta for teleportation -- solves spider traps
    A = (beta * M) + ((1 - beta) * N)

    # power method to solve for rank
    i = 0
    while True:
        new_ranks = A.dot(ranks)
        error = np.sum(np.abs(new_ranks - ranks)) 

        assert not np.isnan(error)

        print("t:", i, "error:", error)
        ranks = new_ranks
        i += 1

        # check if error is acceptable
        if error < e:
            break

    return {idx_to_vertex[i]: page_rank for i, page_rank in enumerate(ranks)}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument("input_graph", help="Input dot graph")
    parser.add_argument("output", help="Output file")

    args = parser.parse_args()
    
    graph, vertices = parse_graph(args.input_graph)
    ranks = rank(graph, vertices)
    write_results(args.output, ranks)
