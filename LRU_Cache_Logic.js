function Node(key,val) {
  this.key = key;
  this.val = val;
  this.left = null;
  this.right = null;
}
function lru_cache() {
  this.root = null;
}
lru_cache.prototype.insert = function(k,v) {
  var n;
  if (( !(Number(k) || k === 0) && typeof k !== "string") 
    || ( !(Number(v) || v === 0) && typeof v !== "string")) {
    throw new Error("Invalid insert");
    return;
  }
  if (this.root === null) {
    this.root = new Node(k,v);
    return;
  }
  this.splay(k);
  if (this.root.key > k) {
    n = new Node(k,v);
    n.left = this.root.left;
    n.right = this.root;
    this.root.left = null;
    this.root = n;
  } 
  else if (this.root.key < k) {
    n = new Node(k,v);
    n.right = this.root.right;
    n.left = this.root;
    this.root.right = null;
    this.root = n;
  } else {
    this.root.val = v;
  }

};
lru_cache.prototype.search = function(k) {
  if (this.root === null || ( !(Number(k) || k === 0) && typeof k !== "string")){
    alert("Database is empty!");
    return null;
  }

  this.splay(k);
  return this.root.key === k ? this.root : null;
};
lru_cache.prototype.remove = function(k) {
  var temp;
  if (this.root === null || (!(Number(k) || k === 0) && typeof k !== "string")){
    alert("Database is empty!");
    return;
  }
  this.splay(k);
  if (this.root.key === k) {
    if (this.root.left === null && this.root.right === null) {
      this.root = null;
    } else if (this.root.left === null) {
      this.root = this.root.right;
    } else {
      temp = this.root.right;
      this.root = this.root.left;
      this.splay(k);
      this.root.right = temp;
    }
  }

};
lru_cache.prototype.min = function(n) {
  var current;
  var minRecursive = function(cNode) {
    if (cNode.left) {
      return minRecursive(cNode.left);
    }
    return cNode;
  };

  if (this.root === null){
    alert("Database is empty!");
    return null;
  }

  if (n instanceof Node)
    current = n;
  else
    current = this.root;

  return minRecursive(current);
};
lru_cache.prototype.max = function(n) {
  var current;
  var maxRecursive = function(cNode) {
    if (cNode.right) {
      return maxRecursive(cNode.right);
    }
    return cNode;
  };

  if (this.root === null){
    alert("Database is empty!");
    return null;
  }

  if (n instanceof Node)
    current = n;
  else
    current = this.root;

  return maxRecursive(current);
};
lru_cache.prototype.inOrder = function(n,fun) {
  if (n instanceof Node) {
    this.inOrder(n.left,fun);
    if (fun) {fun(n);}
    this.inOrder(n.right,fun);
  }
};
lru_cache.prototype.contains = function(k) {
  var containsRecursive = function(n) {
    if (n instanceof Node) {
      if (n.key === k) {
        return true;
      }
      containsRecursive(n.left);
      containsRecursive(n.right);
    }
  };

  if (this.root === null || (!(Number(k) || k === 0) && typeof k !== "string"))
    return false;

  return containsRecursive(this.root) ? true : false;
};
lru_cache.prototype.rotateRight = function(n) {
  var temp;
  if (n instanceof Node) {
    temp = n.left;
    n.left = temp.right;
    temp.right = n;
  }
  return temp;
};
lru_cache.prototype.rotateLeft = function(n) {
  var temp;
  if (n instanceof Node) {
    temp = n.right;
    n.right = temp.left;
    temp.left = n;
  }
  return temp;
};
lru_cache.prototype.splay = function(k) {
  var splayRecursive = function(n, key) {
    if (n === null)
      return null;
    if (key < n.key) {
      if (n.left === null) 
        return n;

      if (key < n.left.key) {
        n.left.left = splayRecursive(n.left.left, key);
        n = this.rotateRight(n);
      } else if (key > n.left.key) {
        n.left.right = splayRecursive(n.left.right, key);
        if (n.left.right !== null)
          n.left = this.rotateLeft(n.left);
      }
      if (n.left === null)
        return n;
      else 
        return this.rotateRight(n);
    } else if (key > n.key) {
      if (n.right === null) 
        return n;

      if (key > n.right.key) {
        n.right.right = splayRecursive(n.right.right, key);
        n = this.rotateLeft(n);

      } else if (key < n.right.key) {
        n.right.left = splayRecursive(n.right.left, key);
        if (n.right.left !== null)
          n.right = this.rotateRight(n.right);
      }
      if (n.right === null)
        return n;
      else 
        return this.rotateLeft(n);
    } else {
      return n;
    }

  }.bind(this);

  if (this.root === null || (!(Number(k) || k === 0) && typeof k !== "string")) {
    throw new Error("Invalid splay");
    return;
  }
  
  this.root = splayRecursive(this.root,k);
  return;
};

var visualJson = function(n) {
  var buildJson = function(cNode) {
    var jObj = {};
    if (cNode !== null) {
      jObj.key = cNode.key;
      jObj.val = cNode.val;
      jObj.children = [];
      jObj.children.push(buildJson(cNode.left));
      jObj.children.push(buildJson(cNode.right));
    } else {
      jObj.key = "empty";
      jObj.val = "leaf";
    }
    return jObj;
  };

  if (!(n instanceof Node))
    return null;

  return buildJson(n);
};


var init = function() {
  var splayTree = new lru_cache();
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 960 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom;

  var svg = d3.select("#tree-display").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var tree = d3.layout.tree().size([height, width]);
  
  var diagonal = d3.svg.diagonal().projection(function(d) { return [d.x, d.y]; });
  var drawTree = function(root) {
    var i = 0;
    var nodes, links;
    svg.selectAll('.node').remove();
    svg.selectAll('.link').remove();
    
    if (root === null)
      return;
    nodes = tree.nodes(root).reverse();
    links = tree.links(nodes);
    nodes.forEach(function(d) { 
      d.y = d.depth * 70; 
    });
    var node = svg.selectAll("g.node").data(nodes, function(d) { 
      return d.id || (d.id = ++i); 
    });
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; 
      });

    nodeEnter.append("circle")
      .attr("r", 10)
      .style("fill", "#ffff00");

    nodeEnter.append("text")
      .attr("y", 18)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { 
        return d.key +' : '+ d.val; 
      })
      .style("fill-opacity", 1);
    var link = svg.selectAll("path.link").data(links, function(d) { 
      return d.target.id; 
    });
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal);
  }
  var highlightMax = function(t) {
    var maxNode;
    if (!(t instanceof lru_cache))
      return;
    else
      maxNode = t.max();
    
    if (maxNode === null)
      return;
    d3.selectAll("g.node").each(function(d,i) { 
      var clearStyle = function() {
        d3.select(this).classed("max", false);
      }.bind(this);
      if (d.key === maxNode.key) {
        d3.select(this).classed("max", true);
        setTimeout(clearStyle,5000);
      }
    });
  };
  var highlightMin = function(t) {
    var minNode;
    if (!(t instanceof lru_cache))
      return;
    else
      minNode = t.min();
    
    if (minNode === null)
      return;
    d3.selectAll("g.node").each(function(d,i) {
      var clearStyle = function() {
        d3.select(this).classed("min", false);
      }.bind(this);
      if (d.key === minNode.key) {
        d3.select(this).classed("min", true);
        setTimeout(clearStyle,5000);
      }
    });
  };
  var formAdd = document.getElementById("add-form");
  var formRemove = document.getElementById("remove-form");
  var formSearch = document.getElementById("search-form");
  var minButton = document.getElementById("min-button");
  var maxButton = document.getElementById("max-button");
  var treeDisplay = document.getElementById("tree-display");
  var iOpen = document.getElementById("info-open-button");
  var iClose = document.getElementById("info-close-button");
  var infoDiv = document.getElementById("info");
  formAdd.addEventListener("submit", function(e) {
    var k,v,rx;
    e.preventDefault();
    k = e.target.keyText.value;
    v = e.target.valText.value;
    rx = /^[a-z]+$/i;

    if ((Number(k) || k === "0") && v.match(rx)) {
      splayTree.insert(Number(k),v);
      drawTree(visualJson(splayTree.root));
      e.target.reset();
    } else {
      alert("key value pair must be a number and string");
    }
  });
  formRemove.addEventListener("submit", function(e) {
    var k;
    e.preventDefault();
    k = e.target.removeText.value;

    if (Number(k) || k === "0") {
      splayTree.remove(Number(k));
      drawTree(visualJson(splayTree.root));
      e.target.reset();
    } else {
      alert("key value must be a number");
    }
  });
  formSearch.addEventListener("submit", function(e) {
    var k;
    e.preventDefault();
    k = e.target.searchText.value;

    if (Number(k) || k === "0") {
      splayTree.search(Number(k));
      drawTree(visualJson(splayTree.root));
      e.target.reset();
    } else {
      alert("key value must be a number");
    }
  });
  maxButton.addEventListener("click", function(e) {
    e.preventDefault();
    highlightMax(splayTree);
  });
  minButton.addEventListener("click", function(e) {
    e.preventDefault();
    highlightMin(splayTree);
  });
  iOpen.addEventListener("click", function(e) {
    e.preventDefault();
    infoDiv.classList.remove("hidden");
    treeDisplay.classList.add("hidden");
  });
  iClose.addEventListener("click", function(e) {
    e.preventDefault();
    treeDisplay.classList.remove("hidden");
    infoDiv.classList.add("hidden");
  });  

};

window.onload = init;