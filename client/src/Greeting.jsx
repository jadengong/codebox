import React from 'react';

// Take a 'name' prop and displays a message
function Greeting(props){
    return (
        <div>
            <h2>Hello, {props.name} 👋</h2>
        </div>
    );
}

export default Greeting;