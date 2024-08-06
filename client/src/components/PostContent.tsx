// src/pages/create-post/CreatePost.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import Linkify from 'react-linkify';

type Props = {
    caption: string;
};

export const parseText = (text: string, onHashtagClick: (hashtag: string) => void): (JSX.Element | string)[] => {
    const words = text.split(' ');

    return words.map((word, index) => {
        if (/^#[a-zA-Z0-9_]+$/.test(word)) {
            return (
                <span 
                    key={index} 
                    className="hashtag" 
                    style={{ color: 'blue', cursor: 'pointer', marginRight: '4px' }} 
                    onClick={() => onHashtagClick(word)}
                >
                    {word}
                </span>
            );
        }
        return word + ' ';
    }).reduce<(JSX.Element | string)[]>((acc, curr) => acc.concat(curr), []);
};

export const PostContent: React.FC<Props> = ({ caption }) => {
    const navigate = useNavigate();

    const handleHashtagClick = (hashtag: string) => {
        navigate(`/post/0/${hashtag.substring(1)}`)
    };

    return (
        <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
            <Linkify
                componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                    <a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer">
                        {decoratedText}
                    </a>
                )}
            >
                {parseText(caption, handleHashtagClick)}
            </Linkify>
        </div>
    );
};
