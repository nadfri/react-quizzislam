import './BoutonLink.scss';
import { Link } from 'react-router-dom';
import image from './buttonBlack.png';

function BoutonLink(props) {
	const background = { backgroundImage: `url(${image})` };

	return (
		<div style={background} className="BoutonLink">
			<Link to={props.link}>{props.content}</Link>
		</div>
	);
}

export default BoutonLink;
