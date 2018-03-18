let marginSankey = { top: 0, right: 0, bottom: 0, left: 0 };
let fullWidthSankey = 1000;
let fullHeightSankey = 1000;
let widthSankey = fullWidthSankey - marginSankey.right - marginSankey.left;
let heightSankey = fullHeightSankey - marginSankey.top - marginSankey.bottom;

let svgSankey;
let formatNumberSankey;
let formatSankey;
let colorSankey;
let sankey;
let linkSankey;
let nodeSankey;

let zero_table = [];
for (let i = 0; i < 24; i++) {
    zero_table.push([]);
    for (let j = 0; j < 24; j++) {
        zero_table[i].push(0);
    }
}
let field_options = {};
let sankey_data = [];
let nodes = [];
let node_to_index = {};
let sankey_table = [];
let links = [];
let sankey_json = {};

d3.csv('data/PoliceKillingsUS.csv', (data) => {
    console.log(data);
    sankey_data = format_data_to_sankey(data);
    field_options = get_all_field_options(sankey_data);
    console.log(field_options);
    nodes = get_nodes(field_options);
    console.log(nodes);
    node_to_index = get_node_to_index_mapping(nodes);
    console.log(node_to_index);
    sankey_table = get_table(sankey_data, node_to_index, zero_table);
    console.log(sankey_table);
    links = get_links(sankey_table, node_to_index);
    console.log(links);
    sankey_json = { 'nodes': nodes, 'links': links };

    initSankey();
});

function initSankey() {
    svgSankey =
        d3.select('#sankey-holder')
            .append('svg')
            .attr('width', fullWidthSankey)
            .attr('height', fullHeightSankey)
            .append('g')
            .attr('transform', 'translate(' + marginSankey.left + ',' + marginSankey.top + ')');
    // format variables
    formatNumberSankey = d3.format(',.2f'); // 2 decimal places
    formatSankey = function (d) {
        return (formatNumberSankey(d * 100)) + '% of users';
    }
    colorSankey = d3.scaleOrdinal(d3.schemeCategory20);
    // sankey diagram properties
    sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(10)
        .extent([[1, 1], [widthSankey - 1, heightSankey - 6]]);
    linkSankey = svgSankey.append('g')
        .attr('class', 'links-sankey')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0.2)
        .selectAll('path');
    nodeSankey = svgSankey.append('g')
        .attr('class', 'nodes-sankey')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('g');
    sankey(sankey_json);
    linkSankey = linkSankey
        .data(sankey_json['links'])
        .enter().append('path')
        .attr('d', d3.sankeyLinkHorizontal())
        .attr('stroke-width', (d) => {
            return Math.max(1, d.width);
        });
    linkSankey.append('title')
        .text((d) => {
            return d.source.name + " -> " + d.target.name + "\n" + formatSankey(d.value);
        });
    nodeSankey = nodeSankey
        .data(sankey_json['nodes'])
        .enter().append('g');
    nodeSankey.append('rect')
        .attr('x', (d) => { return d.x0; })
        .attr('y', (d) => { return d.y0; })
        .attr('height', (d) => { return d.y1 - d.y0; })
        .attr('width', (d) => { return d.x1 - d.x0; })
        .attr('fill', (d) => { return colorSankey(d.name.replace(/ .*/, "")); })
        .attr('stroke', '#000');
    nodeSankey.append('text')
        .attr('x', (d) => { return d.x0 - 6; })
        .attr('y', (d) => { return (d.y1 + d.y0) / 2; })
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text((d) => { return d.name; })
        .filter((d) => { return d.x0 < widthSankey / 2; })
        .attr('x', (d) => { return d.x1 + 6; })
        .attr('text-anchor', 'start');
    nodeSankey.append('title')
        .text((d) => { return d.name + '\n' + formatSankey(d.value); });
}

function get_links(table, node_to_index) {
    let links = [];
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[0].length; j++) {
            if (table[i][j] !== 0) {
                links.push({ 'source': i, 'target': j, 'value': table[i][j] });
            }
        }
    }
    return links;
}

function get_table(data, node_to_index, zero_table) {
    let table = zero_table;
    let genderIndex;
    let raceIndex;
    let mentalIndex;
    let fleeIndex;
    let armedIndex;
    let threatIndex;
    let bodycamIndex;
    for (entry of data) {
        genderIndex = node_to_index[entry['gender']];
        raceIndex = node_to_index[entry['race']];
        mentalIndex = node_to_index[entry['signs_of_mental_illness']];
        fleeIndex = node_to_index[entry['flee']];
        armedIndex = node_to_index[entry['armed']];
        threatIndex = node_to_index[entry['threat_level']];
        bodycamIndex = node_to_index[entry['body_camera']];

        table[genderIndex][raceIndex]++;
        table[raceIndex][mentalIndex]++;
        table[mentalIndex][fleeIndex]++;
        table[fleeIndex][armedIndex]++;
        table[armedIndex][threatIndex]++;
        table[threatIndex][bodycamIndex]++;
    }
    return table;
}

function format_data_to_sankey(data) {
    let sankey_data = [];
    let sankey_entry = {};
    for (entry of data) {
        if (entry['flee'] === '' || entry['race'] === '' || entry['armed'] === '') {
            continue;
        }
        sankey_entry = {};
        for (key in entry) {
            sankey_entry[key] = entry[key].toLowerCase();
        }

        if (sankey_entry['armed'].includes('gun')) {
            sankey_entry['armed'] = 'gun';
        } else if (sankey_entry['armed'].includes('vehicle') || sankey_entry['armed'].includes('motorcycle')) {
            sankey_entry['armed'] = 'vehicle';
        } else if (sankey_entry['armed'].includes('undetermined')) {
            sankey_entry['armed'] = 'undetermined if armed';
        } else if (sankey_entry['armed'].includes('unarmed')) {
            sankey_entry['armed'] = 'unarmed';
        } else {
            sankey_entry['armed'] = 'hand weapon';
        }

        if (sankey_entry['body_camera'] === 'true') {
            sankey_entry['body_camera'] = 'body camera';
        } else {
            sankey_entry['body_camera'] = 'no body camera';
        }

        if (sankey_entry['signs_of_mental_illness'] === 'true') {
            sankey_entry['signs_of_mental_illness'] = 'mentally ill';
        } else {
            sankey_entry['signs_of_mental_illness'] = 'not mentally ill';
        }

        if (sankey_entry['threat_level'] === 'other') {
            sankey_entry['threat_level'] = 'not attack';
        }

        sankey_data.push(sankey_entry);
    }
    return sankey_data;
}

function get_all_field_options(dataset) {
    let options = {};
    for (entry of dataset) {
        for (key in entry) {
            if (!(key in options)) {
                options[key] = [entry[key]];
            } else {
                if (!options[key].includes(entry[key])) {
                    options[key].push(entry[key]);
                }
            }
        }
    }
    delete options['age'];
    delete options['city'];
    delete options['date'];
    delete options['id'];
    delete options['name'];
    delete options['state'];
    delete options['manner_of_death'];
    return options;
}

function get_nodes(options) {
    let nodes = [];
    for (key in options) {
        for (item of options[key]) {
            nodes.push({ 'name': item });
        }
    }
    return nodes;
}

function get_node_to_index_mapping(nodes) {
    let node_to_index = {};
    let i = 0;
    for (node_dict of nodes) {
        node_to_index[node_dict['name']] = i;
        i++;
    }
    return node_to_index;
}
