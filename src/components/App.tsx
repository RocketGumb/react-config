import * as React from 'react';
import image from '@media/image.jpg';

interface IPerson {
	name: string,
	age: number,
	hobby: string[]
}

const App: React.FC = () => {
	const Person: IPerson = {
		name: 'Dion',
		age: 21,
		hobby: [
			'React',
			'Layout',
			'UFC',
		],
	};
	return (
		<>
			<p>Name: {Person.name}</p>
			<p>Age: {Person.age}</p>
			<p>Hobby:</p>
			<ul>
				{Person.hobby.map(item => <li key={item}>{item}</li>)}
			</ul>
			<img src={image} alt=""/>
		</>
	);
};

export default App;
