import React from 'react'

function Logout({ username, history}) {
    
   const clearUser = () => {
        localStorage.clear()
        history.push('/')
    }
    
    return (
        <div>
             <h2>Come back soon! {username}!</h2>
            {clearUser()}
        </div>
    )
}

export default Logout