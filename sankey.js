function SankeyDiagram(container, data) {
    let fullWidthSankey = window.innerWidth * 0.4;
    let fullHeightSankey = window.innerHeight * 0.45;
    let marginSankey = {
        top: 0,
        right: fullWidthSankey - (fullWidthSankey * 0.90),
        bottom: 0,
        left: fullWidthSankey - (fullWidthSankey * 0.95)
    };
    let widthSankey = fullWidthSankey - marginSankey.right - marginSankey.left;
    let heightSankey = fullHeightSankey - marginSankey.top - marginSankey.bottom;

    let svgSankey;
    let formatNumberSankey;
    let formatSankey;
    let colorSankey;
    let sankey;
    let linkSankey;
    let nodeSankey;

    let index_to_node;
    let node_to_category = {
        'armed': 'Armed?: ',
        'unarmed': 'Armed?: ',
        'hand weapon': 'Armed?: ',
        'vehicle': 'Armed?: ',
        'undetermined if armed': 'Armed?: ',
        'male': 'Gender: ',
        'female': 'Gender: ',
        'asian': 'Race: ',
        'white': 'Race: ',
        'hispanic': 'Race: ',
        'black': 'Race: ',
        'other Race': 'Race: ',
        'native american': 'Race: ',
        'mentally ill': '',
        'not mentally ill': '',
        'attacking': 'Threat Level: ',
        'not attacking': 'Threat Level: ',
        'undetermined': 'Threat Level: ',
        'not fleeing': '',
        'fleeing by car': '',
        'fleeing on foot': '',
        'unsure': 'Fleeing?: ',
        'no body camera': 'Body Camera: ',
        'body camera': 'Body Camera: ',
    };

    let tooltipSankey;

    let num_entries = 0;

    this.update = function (data, selection) {
        container.selectAll('*').remove();

        if (selection.length === 0) {
            initSankey(data);
        } else {
            let filtered_data = data.filter((d) => {
                for (state of selection) {
                    if (d['state'] === state) {
                        return d;
                    }
                }
            });
            initSankey(filtered_data);
        }
    }

    function initSankey(data) {
        let sankey_json = format_data_to_sankey(data);
        svgSankey = container
            .append('svg')
            .attr('width', fullWidthSankey)
            .attr('height', fullHeightSankey)
            .append('g')
            .attr('transform', 'translate(' + marginSankey.left + ',' + marginSankey.top + ')');
        formatNumberSankey = d3.format(',.2f'); // 2 decimal places
        colorSankey = d3.scaleOrdinal(d3.schemeCategory20);
        formatSankey = function (d) {
            return (formatNumberSankey(d / num_entries * 100)) + '% of shootings';
        }
        tooltipSankey =
            d3.select('#sankey-holder')
                .append('div')
                .attr('class', 'tooltipSankey');
        // sankey diagram properties
        sankey = d3.sankey()
            .nodeWidth(10)
            .nodePadding(10)
            .extent([[1, 1], [widthSankey - 1, heightSankey - 6]]);
        linkSankey = svgSankey.append('g')
            .attr('class', 'links-sankey')
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-opacity', 0.5)
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
            })
            .on('mousemove', (d) => {
                tooltipSankey
                    .style('left', d3.event.pageX - 50 + 'px')
                    .style('top', d3.event.pageY - 90 + 'px')
                    .style('display', 'inline-block')
                    .html(
                        index_to_node[d['source']['index']] + ' -> ' + index_to_node[d['target']['index']]
                        + '<br><span>' + d['value'] + ' victims</span>'
                        + '<br><span>' + (d['value'] / num_entries * 100).toFixed(2) + ' % of victims</span>'
                    );
            })
            .on('mouseout', (d) => { tooltipSankey.style('display', 'none'); });
        nodeSankey = nodeSankey
            .data(sankey_json['nodes'])
            .enter().append('g')
            .on('mousemove', (d) => {
                tooltipSankey
                    .style('left', d3.event.pageX - 50 + 'px')
                    .style('top', d3.event.pageY - 90 + 'px')
                    .style('display', 'inline-block')
                    .html(
                        node_to_category[d['name']] + d['name']
                        + '<br><span>' + d['value'] + ' victims</span>'
                        + '<br><span>' + (d['value'] / num_entries * 100).toFixed(2) + ' % of victims</span>'
                    );
            })
            .on('mouseout', (d) => { tooltipSankey.style('display', 'none'); });
        nodeSankey.append('rect')
            .attr('x', (d) => { return d.x0; })
            .attr('y', (d) => { return d.y0; })
            .attr('height', (d) => { return d.y1 - d.y0; })
            .attr('width', (d) => { return d.x1 - d.x0; })
            // .attr('fill', (d) => { return colorSankey(d.name.replace(/ .*/, "")); })
            .attr('fill', (d) => { return 'lightsalmon'; })
            .attr('stroke', '#333');
        nodeSankey.append('text')
            .attr('x', (d) => { return d.x0 - 6; })
            .attr('y', (d) => { return (d.y1 + d.y0) / 2; })
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .text((d) => { return d.name; })
            .filter((d) => { return d.x0 < widthSankey / 2; })
            .attr('x', (d) => { return d.x1 + 6; })
            .attr('text-anchor', 'start');
    }

    function get_links(table, node_to_index) {
        let links = [];
        for (i = 0; i < table.length; i++) {
            for (j = 0; j < table[0].length; j++) {
                if (table[i][j] !== 0) {
                    links.push({ 'source': i, 'target': j, 'value': table[i][j] });
                }
            }
        }
        return links;
    }

    function get_table(data, node_to_index) {
        let table = get_zero_table(Object.keys(node_to_index).length);
        for (entry of data) {
            let genderIndex = -1;
            let raceIndex = -1;
            let mentalIndex = -1;
            let fleeIndex = -1;
            let armedIndex = -1;
            let threatIndex = -1;
            let bodycamIndex = -1;

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
        let field_options = {};
        let nodes = [];
        let node_to_index = {};
        let sankey_table = [];
        let links = [];
        let sankey_data = [];
        let sankey_entry = {};
        let mapping = {
            'gun': 'armed',
            'unarmed': 'unarmed',
            'hand weapon': 'hand weapon',
            'vehicle': 'vehicle',
            'undetermined if armed': 'undetermined if armed',
            'm': 'male',
            'f': 'female',
            'a': 'asian',
            'w': 'white',
            'h': 'hispanic',
            'b': 'black',
            'o': 'other race',
            'n': 'native american',
            'mentally ill': 'mentally ill',
            'not mentally ill': 'not mentally ill',
            'attack': 'attacking',
            'not attacking': 'not attacking',
            'undetermined': 'undetermined',
            'not fleeing': 'not fleeing',
            'car': 'fleeing by car',
            'foot': 'fleeing on foot',
            'other': 'unsure',
            'no body camera': 'no body camera',
            'body camera': 'body camera',
        }
        num_entries = 0;
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
                sankey_entry['threat_level'] = 'not attacking';
            }

            for (key in sankey_entry) {
                sankey_entry[key] = mapping[sankey_entry[key]];
            }
            num_entries++;
            sankey_data.push(sankey_entry);
        }
        field_options = get_all_field_options(sankey_data);
        nodes = get_nodes(field_options);
        node_to_index = get_node_to_index_mapping(nodes);
        index_to_node = get_index_to_node_mapping(nodes);
        sankey_table = get_table(sankey_data, node_to_index);
        links = get_links(sankey_table, node_to_index);

        return { 'nodes': nodes, 'links': links };
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

    function get_index_to_node_mapping(nodes) {
        let index_to_node = {};
        let i = 0;
        for (node_dict of nodes) {
            index_to_node[i.toString()] = node_dict['name'];
            i++;
        }
        return index_to_node;
    }

    function get_zero_table(size) {
        let table = [];
        for (i = 0; i < size; i++) {
            table.push([]);
            for (j = 0; j < size; j++) {
                table[i].push(0);
            }
        }
        return table;
    }

    initSankey(data);
}