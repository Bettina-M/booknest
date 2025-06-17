const pool = require("../database")

exports.findByEmail = async (email) =>{
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0]
}

exports.createUser = async (firstname, lastname, email, hashedPassword) => {
  const query = {
    text: `
      INSERT INTO users (firstname, lastname, email, pass)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    values: [firstname, lastname, email, hashedPassword]
  };

  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (err) {
    console.error('Database insert error:', err);
    throw err;
  }
};