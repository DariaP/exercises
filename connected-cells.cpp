/*
Consider a matrix with  rows and  columns, where each cell contains either a  or a  and any cell containing a  is called a filled cell. Two cells are said to be connected if they are adjacent to each other horizontally, vertically, or diagonally; in other words, cell  is connected to cells , , , , , , , and , provided that the location exists in the matrix for that .

If one or more filled cells are also connected, they form a region. Note that each cell in a region is connected to at least one other cell in the region but is not necessarily directly connected to all the other cells in the region.

Task
Given an  matrix, find and print the number of cells in the largest region in the matrix. Note that there may be more than one region in the matrix.

Input Format

The first line contains an integer, , denoting the number of rows in the matrix.
The second line contains an integer, , denoting the number of columns in the matrix.
Each line  of the  subsequent lines contains  space-separated integers describing the respective values filling each row in the matrix.
*/

#include <iostream>
#include <vector>
#define BOOST_TEST_MODULE TwoNumbersTests
#define BOOST_TEST_MAIN
#define BOOST_TEST_DYN_LINK
#include <boost/test/unit_test.hpp>

class Graph {
  std::vector<int> nodes;
  std::vector<std::vector<int>> links;

  int addNode(int weight) {
    nodes.push_back(weight);
    links.push_back(std::vector<int>());
    return nodes.size() - 1;
  }

  void addLink(int idx1, int idx2) {
    links[idx1].push_back(idx2);
    links[idx2].push_back(idx1);
  }

  std::vector<int> addAllNodes(
    const std::vector<int> &row)
  {
    int nextIntervalStart = -1;
    std::vector<int> result(row.size(), -1);

    for (int i = 0 ; i <= row.size() ; ++i) {
      if (i < row.size() && row[i] == 1) {
        if (nextIntervalStart == -1) {
          nextIntervalStart = i;
        }
      } else {
        if (nextIntervalStart != -1) {
          int nodeIdx = addNode(i - nextIntervalStart);
          for (int j = nextIntervalStart ; j < i ; ++j) {
            result[j] = nodeIdx;
          }
          nextIntervalStart = -1;
        }
      }
    }

    return result;
  }

  std::pair<int, int> findNextNode(const std::vector<int> &intervals,
    int searchStart, int searchEnd) const
  {
    std::pair<int, int> borders(-1, -1);
    for (int i = searchStart ; i <= searchEnd ; ++i) {
      if (intervals[i] != -1) {
        if (borders.first == -1) {
          borders.first = i;
        }
      } else {
        if (borders.first != -1) {
          borders.second = i - 1;
          break;
        }
      }
    }
    if (borders.first != -1 && borders.second == -1) {
      borders.second = searchEnd;
    }
    return borders;
  }

  std::vector<std::pair<int, int>> findAllNodes(const std::vector<int> &intervals,
    int searchStart, int searchEnd) const
  {
    std::vector<std::pair<int, int>> result;
    std::pair<int, int> nextNode = findNextNode(intervals, searchStart, searchEnd);

    while (nextNode.second != -1) {
      result.push_back(nextNode);
      nextNode = findNextNode(intervals, nextNode.second + 2, searchEnd);
    }
    return result;
  }

  void connectNodes(const std::vector<int> &prevRowIntervals,
    const std::vector<int> &nextRowIntervals)
  {
    std::pair<int, int> prevInterval({-1, -1}),
      nextNode = findNextNode(nextRowIntervals, 0, prevRowIntervals.size() - 1);

    while (nextNode.first != -1) {
      auto connectedPrevNodes = findAllNodes(prevRowIntervals,
        (nextNode.first == 0) ? 0 : nextNode.first - 1,
        (nextNode.second == nextRowIntervals.size() - 1) ?
          (nextRowIntervals.size() - 1) : nextNode.second + 1
      );

      for (auto node: connectedPrevNodes) {
        addLink(prevRowIntervals[node.first],
          nextRowIntervals[nextNode.first]);
      }

      nextNode = findNextNode(nextRowIntervals,
        nextNode.second + 1, nextRowIntervals.size() - 1
      );
    }
  }

  int connectedComponentSize(int startNode, std::vector<bool> &visited) {
    std::vector<int> connectedNodes;
    connectedNodes.push_back(startNode);
    int size = 0;
    while (!connectedNodes.empty()) {
      int node = connectedNodes[connectedNodes.size() - 1];
      connectedNodes.pop_back();
      //std::cout << node  << std::endl;

      if (!visited[node]) {
        size += nodes[node];
        visited[node] = true;
        for (int linkedNode: links[node]) {
          connectedNodes.push_back(linkedNode);
        }
      }
    }
    return size;
  }

public:
  Graph(const std::vector<std::vector<int>> &grid) {

    std::vector<int> prevRowConnectedIntervals;

    for (int i = 0 ; i < grid.size() ; ++i) {
      std::vector<int> nextRowConnectedIntervals =
        addAllNodes(grid.at(i));
      if (i != 0) {
        connectNodes(prevRowConnectedIntervals, nextRowConnectedIntervals);
      }
      prevRowConnectedIntervals = nextRowConnectedIntervals;
    }
  }

  int maxConnectedComponent() {
    std::vector<bool> visited(nodes.size(), false);
    int nextStart = 0, maxSize = 0;

    while (nextStart < visited.size()) {
      int nextSize = connectedComponentSize(nextStart, visited);
      if (nextSize > maxSize) {
        maxSize = nextSize;
      }
      while (nextStart < visited.size() && visited[nextStart]) nextStart++;
    }
    return maxSize;
  }
};

int maxSize(const std::vector<std::vector<int>> &grid) {
  Graph graph(grid);
  return graph.maxConnectedComponent();
}

#define CHECK_CONNECTED_CELLS(gridValues, expectedSize) { \
  std::vector<std::vector<int>> grid = gridValues; \
  int actualSize = maxSize(grid); \
  BOOST_CHECK_EQUAL(expectedSize, actualSize); \
}

#define ARRAY_ARG_PROTECT(...) __VA_ARGS__

BOOST_AUTO_TEST_CASE( two_numbers_tests ) {
  CHECK_CONNECTED_CELLS({{0}}, 0)
  CHECK_CONNECTED_CELLS({{1}}, 1)
  CHECK_CONNECTED_CELLS(ARRAY_ARG_PROTECT({
    {1, 0, 0, 1, 1}
  }), 2)
  CHECK_CONNECTED_CELLS(ARRAY_ARG_PROTECT({
    {0, 0, 1, 1, 0}
  }), 2)
  CHECK_CONNECTED_CELLS(ARRAY_ARG_PROTECT({
    {1, 1, 1, 1}
  }), 4)

  CHECK_CONNECTED_CELLS(ARRAY_ARG_PROTECT({
    {0, 0},
    {0, 0},
  }), 0)

  CHECK_CONNECTED_CELLS(ARRAY_ARG_PROTECT({
    {1, 1},
    {1, 1},
  }), 4)

  CHECK_CONNECTED_CELLS(ARRAY_ARG_PROTECT({
    {1, 0, 1, 0, 1},
    {0, 1, 0, 1, 0},
    {1, 0, 1, 0, 1},
    {0, 1, 0, 1, 0},
    {1, 0, 1, 0, 1}
  }), 13)

  CHECK_CONNECTED_CELLS(ARRAY_ARG_PROTECT({
    {1, 0, 0, 1, 1},
    {0, 1, 1, 1, 0},
    {1, 0, 0, 0, 0},
    {0, 0, 1, 1, 1},
    {1, 1, 1, 1, 1}
  }), 8)
}
