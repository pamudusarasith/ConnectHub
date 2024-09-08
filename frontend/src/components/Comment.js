import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { formatDistanceToNow } from 'date-fns';
import TextField from '@mui/material/TextField';

function Comment({openComment, setOpenComment}) {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const textareaRef = useRef(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await axios.get('/api/comments');
            setComments(response.data.data);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim()) {
            try {
                let response;
                if (editingCommentId) {
                    response = await axios.put(`/api/comments/${editingCommentId}`, { text: comment });
                } else {
                    response = await axios.post('/api/comments', {text:comment});
                }

                if (response.status === 200) {
                    const result = response.data.data;
                    if (!response.data.success && response.data.code === 401) {
                        navigate("/login");
                    }
                    console.log('Comment saved:', result);

                    fetchComments();

                    setComment("");

                    setEditingCommentId(null);

                    textareaRef.current.style.height = "40px";
            
                    } else {
                        console.error('Failed to save the comment');
                    }
                } catch (error) {
                    console.error('Error:', error.response ? error.response.data : error.message);
                }
        } else {
            console.log('Comment cannot be empty');
        }
    };

    const handleChange = (e) => {
        setComment(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    const deleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`/api/comments/${commentId}`, {
            });

            if (response.status === 200) {
                console.log('Comment deleted');
                setComments(comments.filter(comment => comment._id !== commentId));
            } else {
                console.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (id, text) => {
        setOpenComment(!openComment);
        setEditingCommentId(id);
        setComment(text);
        textareaRef.current.focus();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <h2>Comments</h2>
                    <div style={{ display: openComment ? 'block' : 'none',marginBlockEnd:'8px' }}>
                        <TextField
                            variant="outlined"
                            multiline
                            rows={1}
                            value={comment}
                            onChange={handleChange}
                            placeholder="Write a comment"
                            style={{ width: '80%', marginRight: '8px' }}
                            ref={textareaRef}
                        /> 

                        <IconButton type="submit">
                            <SendIcon />
                        </IconButton>
                    </div>
                </label>
            </form>

            <div>
                {comments.map(comment => (
                    <div 
                        key={comment._id}
                        style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            margin: '10px 0', 
                            border: '1px solid #ccc', 
                            padding: '10px', 
                            borderRadius: '4px',
                            wordBreak: 'break-word'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src="/broken-image.jpg" />
                            <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{comment.author.username}</span>
                            {comment.createdAt && (
                                <span style={{ marginLeft: '10px', color: '#888' }}>
                                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                                </span>
                            )}
                            {comment.edited && (
                                <span>
                                    (edited)
                                </span>
                            )}
                        </div>
                        <pre style={{ flex: 1, margin: 0, whiteSpace: 'pre-wrap', textAlign: 'left' }}>{comment.text}</pre>
                        <div>
                            <IconButton onClick={() => deleteComment(comment._id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => handleEdit(comment._id, comment.text)}>
                                <EditIcon />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Comment;