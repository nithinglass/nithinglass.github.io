// https://observablehq.com/@garciaguillermoa/force-directed-graph@149
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Employer networks `
)});
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","drag","color","invalidation"], function(data,d3,width,height,drag,color,invalidation)
{
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

 

  const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id))
  .force('charge', d3.forceManyBody().strength(-10))
  .force("center", d3.forceCenter(width / 2, height/2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return 50
  }));

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => d.weight*5);

  const node = svg.append("g")
    .selectAll(".node")
    .data(nodes)
    .join("g")
      .attr('class', 'node')
      .call(drag(simulation));

  node.append('circle')
      .attr("r", function(d) { return d.UserMonop/25; })
      .attr("fill", color);
  
  node.append("text")
      .text(function(d) {
        return d.shortName;
      })
      .style('fill', '#000')
      .style('font-size', '12px')
      .attr('x', 6)
      .attr('y', 3);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}
);

main.variable(observer("data")).define("data", ["d3"], function(d3){return(
d3.json("https://gist.githubusercontent.com/nithinglass/706e1a38e436051a053a262b41cb0820/raw/ad1c4c3e4f31697c005f0b30ec48ecbeba3eae07/graphson.json")
  //d3.json("graphson.json")
)});


main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.sectorName);
}
);
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
