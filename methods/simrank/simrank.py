import argparse
import numpy
import itertools
import networkx

def parse_graph(fname: str):
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
        G = networkx.DiGraph()
        edges = set([])
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

                    edges.add((parent, child))

        except Exception as e:
            print(f"ERROR: {fname} is not in the right format!")
            print("ERROR: expected\ndigraph {\nA -> B\nB -> C\nC -> D\n...etc\n}")
            print(f"ERROR: failed on line number {i}; {line}")
            print(str(e))
            exit(1)

        G.add_edges_from(list(edges))
        return G

def simrank(G, r=0.8, max_iter=100, eps=1e-4):

    nodes = list(G.nodes())
    nodes_i = {}
    for i in range(len(nodes)):
        nodes_i[nodes[i]] = i

    sim_prev = numpy.zeros(len(nodes))
    sim = numpy.identity(len(nodes))

    for i in range(max_iter):
        if numpy.allclose(sim, sim_prev, atol=eps):
            break
        sim_prev = numpy.copy(sim)
        for u, v in itertools.product(nodes, nodes):
            if u is v:
                continue
            u_ns, v_ns = list(G.predecessors(u)), list(G.predecessors(v))

            # evaluating the similarity of current iteration nodes pair
            if len(u_ns) == 0 or len(v_ns) == 0: 
                # if a node has no predecessors then setting similarity to zero
                sim[nodes_i[u]][nodes_i[v]] = 0
            else:                    
                s_uv = sum([sim_prev[nodes_i[u_n]][nodes_i[v_n]] for u_n, v_n in itertools.product(u_ns, v_ns)])
                sim[nodes_i[u]][nodes_i[v]] = (r * s_uv) / (len(u_ns) * len(v_ns))

    sim = sim.round(3)

    ranks = {}
    for node in nodes:
        parents = G.predecessors(node)
        for parent in parents:
            ranks[parent] = ranks.get(parent, [])
            ranks[parent].append(sim[nodes_i[parent]][nodes_i[node]])

    # store average similarity
    for parent, p_ranks in ranks.items():
        ranks[parent] = numpy.mean(p_ranks)

    return ranks

def write_results(out: str, ranks) -> None:
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


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument("input_graph", help="Input dot graph")
    parser.add_argument("output", help="Output file")

    args = parser.parse_args()

    G = parse_graph(args.input_graph)
    results = simrank(G)
    write_results(args.output, results)
    

