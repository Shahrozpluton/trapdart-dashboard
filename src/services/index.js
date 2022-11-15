import axios from "axios";

const createBackendServer = baseURL => {

    const api = axios.create({
        baseURL,
        headers: {'Accept': 'application/json'},
        timeout: 60 * 1000
    });

    /*==========    GET REQUESTS    ==========*/

    const getAllProposals = () => api.get('/api/proposals');

    const getTypeProposals = (type) => api.get(`/api/proposals/type/${type}`);

    const getAllStrokes = () => api.get(`/api/strokes`);

    const getSingleProposal = (id) => api.get(`/api/proposals/${id}`);

    const getProposalsByStroke = (id) => api.get(`/api/strokes/${id}`)

    /*==========    POST REQUESTS    ==========*/

    const addProposal = (body) => api.post('/api/proposals', body);
    const createStroke = (body) => api.post('/api/strokes', body);

    const updatePicture = (id, body) => api.post(`/api/picture/${id}`, body);

    const updateText = (id, body) => api.post(`/api/text/${id}`, body);

    const updateStroke = (id, body) => api.put(`/api/strokes/${id}`, body)

    return {
        updateText,
        addProposal,
        createStroke,
        updateStroke,
        getAllStrokes,
        getAllProposals,
        getTypeProposals,
        getSingleProposal,
        getProposalsByStroke,
        updatePicture
    };

};

const apis = createBackendServer(process.env.REACT_APP_BSE_API_URL);


export default apis;
