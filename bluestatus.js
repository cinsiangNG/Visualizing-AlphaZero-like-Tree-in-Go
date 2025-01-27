function drawPolicyStatusBoard(container, root_info, top_info) {
    // 清空现有状态板
    let statusBoard = container.select('.status-board');
    if (statusBoard.empty()) {
        statusBoard = container.append('div')
            .attr('class', 'status-board')
            .style('width', '100%')
            .style('height', '100%')
            .style('padding', '10px')
            .style('border', '0px solid black')
            .style('align-content', 'center')
            .style('left', '50%') 
            .style('top', '17.5%')
            .style('background-color', 'white')
            .style('font-family', 'Times New Roman, serif')
            .style('font-size', '16px');
    } else {
        statusBoard.html(''); // 清空现有内容
    }
    
    if (top_info[0].action[0] === 'B') {
        statusBoard.append('div')
        .text('Black Round')
        .style('font-size', '25px')
        .style('font-weight', 'bold');
    }
    else{
        statusBoard.append('div')
        .text('White Round')
        .style('font-size', '25px')
        .style('font-weight', 'bold');
    }
    statusBoard.append('div').html(`<strong>Value:</strong> ${root_info.v.toFixed(3)}`);
    statusBoard.append('div').html(`<strong>Action:</strong> ${root_info.action}`);
    statusBoard.append('div')
        statusBoard.append('div')
        .html(`<strong>Black Winrate:</strong> ${((root_info.v+1)*50).toFixed(2)}%`);
    statusBoard.append('div').html('&nbsp;'); 
    statusBoard.append('div')
        .html(`<strong>Top 3 Policy:</strong>`);
        top_info.forEach(({ policy, action}, index) => {
            statusBoard.append('div')
                .text(`${index + 1}. ${action.substring(2, action.indexOf(']'))} (${(policy*100).toFixed(2)}%)`)
                .style('font-size', '19px')
        });

}

function drawValueStatusBoard(container, root_info, top_info) {
    // 清空现有状态板
    let statusBoard = container.select('.status-board');
    if (statusBoard.empty()) {
        statusBoard = container.append('div')
            .attr('class', 'status-board')
            .style('width', '100%')
            .style('height', '100%')
            .style('padding', '10px')
            .style('border', '0px solid black')
            .style('align-content', 'center')
            .style('left', '50%') 
            .style('top', '17.5%')
            .style('background-color', 'white')
            .style('font-family', 'Times New Roman, serif')
            .style('font-size', '16px');
    } else {
        statusBoard.html(''); // 清空现有内容
    }
    if (top_info[0].action[0] === 'B') {
        statusBoard.append('div')
        .text('Black Round')
        .style('font-size', '25px')
        .style('font-weight', 'bold');
    }
    else{
        statusBoard.append('div')
        .text('White Round')
        .style('font-size', '25px')
        .style('font-weight', 'bold');
    }
    statusBoard.append('div')
        .html(`<strong>Policy:</strong> ${(root_info.p*100).toFixed(2)}%`);
    statusBoard.append('div').html(`<strong>Action:</strong> ${root_info.action}`);
    statusBoard.append('div').html('&nbsp;'); 
    statusBoard.append('div')
        .html(`<strong>Bottom 3 Value:</strong>`);
        top_info.forEach(({ value, action}, index) => {
            statusBoard.append('div')
                .text(`${index + 1}. ${action.substring(2, action.indexOf(']'))} (${(value.toFixed(3))})`)
                .style('font-size', '19px')
        });

}

function info(tree) {
    const v = extractValueFromRoot(tree, "v");
    const p = extractValueFromRoot(tree, "p");
    const q = extractValueFromRoot(tree, "q");
    const n = extractValueFromRoot(tree, "n");
    const action = extractValueFromRoot(tree, "action");
    return {
        n,
        v,
        q,
        p,
        action,
        //result.get("v")
        get: function (key) {
            return this[key] !== undefined ? this[key] : null;
        }
    };
}

function extractTopPValuesAndActions(Pvalue, actions, topN = 3) {
    const combined = Pvalue.map((value, index) => ({
        policy: value,
        action: actions[index]
    }));

    const sorted = combined.sort((a, b) => b.policy - a.policy);
    const topValues = sorted.slice(0, topN);

    return topValues; 
}

function extractTopVValuesAndActions(Vvalue, actions, topN = 3) {
    const combined = Vvalue.map((value, index) => ({
        value: value,
        action: actions[index]
    }));

    const sorted = combined.sort((a, b) => a.value - b.value);
    const topValues = sorted.slice(0, topN);

    return topValues; 
}