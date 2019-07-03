var api = (result=0, data=null) => {
    let out = {result: result};
    if (data!==null) out.data = data;
    return JSON.stringify(out, null, 2);
};

module.exports = api; 