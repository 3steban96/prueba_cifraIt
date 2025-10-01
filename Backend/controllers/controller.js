const pool = require ('../config/database.js')

async function login (req,res){
    try {
        const {username, password}= req.body;
        const [users]= await pool.query(
            'SELECT id, username, role, full_name FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        if(users.length > 0){
            res.status(200).json({success: true, user: users[0]});
        }else{
            res.status(401).json({success: false, message: 'Invalid credentials'});            
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

async function createRequest(req,res) {
    try {
        const {asunto: title, descripcion: description, clientId: client_id, categoria, prioridad} = req.body;
        
        const [clientResult] = await pool.query(
            'SELECT full_name FROM users WHERE id = ?',
            [client_id]
        );

        if (!clientResult.length) {
            return res.status(400).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO requests (client_id, client_name, title, description, status, category, priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [client_id, clientResult[0].full_name, title, description, 'pending', categoria, prioridad]
        );

        res.status(201).json({
            success: true,
            message: 'Solicitud creada exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({success: false, message: error.message});
    }    
}
async function getCustomerRequests(req,res) {
    try {
        const {client_id}= req.params;
        console.log('Received client_id:', client_id);
        const [requests]= await pool.query(
            'SELECT * FROM requests WHERE client_id = ? ORDER BY created_at DESC',
            [client_id]
        )
        res.status(200).json({success:true, requests});
    } catch (error) {
        res.status(500).json({success: false, message:error.message})
    }
}

async function getSupportRequests(req, res) {
    try {
        const { supportId } = req.params;
        console.log('Received supportId:', supportId);
        console.log('Type:', typeof supportId);
        
        const [requests] = await pool.query(
            'SELECT * FROM requests WHERE support_id = ? OR status = "pending" ORDER BY created_at DESC',
            [parseInt(supportId)] // Asegura que sea número
        );
        
        console.log('Requests found:', requests.length);
        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error('Error in getSupportRequests:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateRequest(req, res) {
    try {
        const { id, status, response, supportId } = req.body; // Changed from support_id to supportId
        console.log('Updating request ID:', id, 'with data:', req.body);
        await pool.query(
            'UPDATE requests SET status = ?, response = ?, support_id = ? WHERE id = ?',
            [status, response, supportId, id] // Changed from support_id to supportId
        );
        
        res.status(200).json({ success: true, message: 'Solicitud actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getAllRequests(req, res) {
    try {
        const { client_id, status, date_start, date_end } = req.query;
        let query = 'SELECT * FROM requests WHERE 1=1';
        let params = [];
        
        if (client_id) {
            query += ' AND client_id = ?';
            params.push(client_id);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (date_start) {
            query += ' AND created_at >= ?';
            params.push(date_start);
        }
        if (date_end) {
            query += ' AND created_at <= ?';
            params.push(date_end);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [requests] = await pool.query(query, params);
        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getStatistics(req, res) {
    try {
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
            FROM requests
        `);
        
        res.status(200).json({ success: true, stats: stats[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getCustomers(req, res) {
    try {
        const [customers] = await pool.query(
            'SELECT id, full_name, username FROM users WHERE role = "client"'
        );
        
        res.status(200).json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    login,
    createRequest,
    getCustomerRequests,
    getSupportRequests,
    updateRequest,
    getAllRequests,
    getStatistics,
    getCustomers
};