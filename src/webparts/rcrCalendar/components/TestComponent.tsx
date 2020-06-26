import * as React from 'react';


const TestComponent = () => {

    const [state, setState] = React.useState(['test1', 'test2', 'test3']);

    console.log(state);

    return (
        <div>
            <ul>
                Проверка
                {state.map((el, index) => (

                <li key={index}>{el}</li>
            )
            )}
            </ul>
        </div>
    );
}


export default TestComponent;