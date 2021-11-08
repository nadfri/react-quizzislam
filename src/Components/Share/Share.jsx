import React from 'react';
import './Share.scss';
import {
	FacebookShareButton,
	LinkedinShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from 'react-share';
import {
	FacebookIcon,
	LinkedinIcon,
	TelegramIcon,
	TwitterIcon,
	WhatsappIcon,
} from 'react-share';

function Share() {
	const quote =
		"Pourras-tu faire mieux que moi à ce Quizz sur l'Islam et te classer dans le TOP 100 ?";
	const url = 'https://quizzislam.netlify.app/';

	return (
		<div className='Share'>
			<FacebookShareButton url={url} quote={quote}>
				<FacebookIcon size={40} round />
			</FacebookShareButton>

			<TwitterShareButton url={url} title={quote}>
				<TwitterIcon size={40} round />
			</TwitterShareButton>

			<WhatsappShareButton url={url} title={quote}>
				<WhatsappIcon size={40} round />
			</WhatsappShareButton>

			<TelegramShareButton title={quote} url={url}>
				<TelegramIcon size={40} round />
			</TelegramShareButton>

			<LinkedinShareButton url={url} title={quote}>
				<LinkedinIcon size={40} round />
			</LinkedinShareButton>
		</div>
	);
}

export default Share;
