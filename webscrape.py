import argparse
import random
from typing import Dict, List, Set
from bs4 import BeautifulSoup
import logging
from urllib.request import urlopen
from os import path
import re

data_folder = "./data"

stanford = "https://www.stanford.edu/"
stanford_news = "https://news.stanford.edu/"
emory = "https://www.emory.edu/"
emory_news = "https://emorywheel.com/"
mit = "https://www.mit.edu/"
mit_news = "https://news.mit.edu/"

PROBABILITY_OF_TELEPORT = 0.2

def bfs(initial_urls: List[str]) -> Dict[str, List[str]]:
    # the ID for each file name; incremented after each file write
    file_id = 0
    graph: Dict[str, List[str]] = {}
    queue: List[str] = [initial_urls.pop()]
    seen: Set[str] = set()

    logging.info(f"beginning bfs scrape on {queue}")

    while len(initial_urls) != 0 or len(queue) != 0:
        size = len(graph.keys())
        if size != 0 and size % 50 == 0 and len(initial_urls) != 0:
                queue = [initial_urls.pop()]

        url = ""
        if random.random() < PROBABILITY_OF_TELEPORT:
            index = random.randrange(0, len(queue))
            url = queue.pop(index)
            logging.info(f"teleported to {url}")
        else:
            url = queue.pop(0)

        if url == "":
            logging.error("Tried to open blank url")
            continue

        logging.debug(url)

        try:
            html = urlopen(url)  
        except Exception as e:
            logging.error(url, e)
            continue

        soup = BeautifulSoup(html, "html.parser")
        anchors = soup.find_all('a')
        text = soup.get_text(strip=True,separator="\n").split("\n")

        with open(path.join(data_folder, f"{file_id}".zfill(4)), "+w") as f:
            f.write(url + "\n")
            f.writelines(text)
            file_id += 1

        for anchor in anchors:
            anchor_href = anchor.get("href")

            if not anchor_href:
                continue

            regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
            anchor_href = [x[0] for x in re.findall(regex, anchor_href)]
            for href in list(anchor_href):
                if href not in seen:
                    # manage queue
                    seen.add(href)
                    queue.append(href)

                    # add url to graph
                    graph[url] = graph.get(url, [])
                    graph[url].append(href)
        
    return graph


def write_dot(graph: Dict[str, List[str]]):
    logging.info(f"writing dot file with {len(graph)} vertices")
    with open("graph.dot", "+w") as f:
        f.write("diagraph {\n")
        for parent, children in graph.items():
            for child in children:
                f.write(f"{parent} -> {child}\n")

        f.write("}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--logLevel", help="the logging level (debug, info, warning, error)", default="warning")
    args = parser.parse_args()
    logging.basicConfig(level=args.logLevel.upper())

    graph = bfs([stanford, stanford_news, mit, mit_news, emory, emory_news])
    write_dot(graph)
