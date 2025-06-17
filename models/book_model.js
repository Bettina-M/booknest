const pool = require("../database")


/*Fetch all cateogries*/
async function getCategories(){
    const result = await pool.query("SELECT * FROM public.categories")
    return result.rows
}

async function getBooksByCategory(category_id) {
    try {
        
        const categoryId = parseInt(category_id);
        
        // Debugging: log the received and converted ID
        console.log(`Fetching books for category ID: ${categoryId} (original: ${category_id})`);
        
        const result = await pool.query(
            `SELECT b.* 
             FROM public.books b
             WHERE b.category_id = $1
             ORDER BY b.book_title`,  
            [categoryId]
        );
        
        console.log(`Found ${result.rows.length} books for category ${categoryId}`);
        return result.rows;
    } catch (error) {
        console.error('Error in getBooksByCategory:', error);
        throw error; 
    }
}

module.exports = {getCategories,getBooksByCategory }