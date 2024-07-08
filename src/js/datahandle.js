// load data
async function loadNodeLinks(){
    // handle node
    let maxTerm = 1;
    const nodes = await d3.csv("src/data/nodes.csv")
    .then(d=>{
        d.forEach(element => {
            ["id","YEAR","TERM","REQUIRE"].forEach(k=>element[k]= +element[k]);
            maxTerm = Math.max(element["TERM"],maxTerm);
        });
        d.forEach(element => {
            ["id","YEAR","TERM","REQUIRE"].forEach(k=>element[k]= +element[k]);
            element._step = element.YEAR+(element.TERM-1)/maxTerm;
        });
        return d;
    });
    let links = await d3.csv("src/data/links.csv")
    .then(d=>{
        d.forEach(element => {
            ["source","target"].forEach(k=>element[k]= +element[k]);
        });
        return d;
    });
    d3.forceSimulation().nodes(nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
        .id(function(d) { return d.id; })                     // This provide  the id of a node
        .links(links)                                 // and this the list of links
    ).stop();
    // check same level
    links.forEach(l=>{
        if(l.source._step===l.target._step)
            l.isSameLevel = true;
    })
    // Update 4/22: remove same level
    links = links.filter(d=>!d.isSameLevel);
    return {nodes,links,xstep:1/maxTerm}
}