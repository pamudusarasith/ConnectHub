import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

function Comment() {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const textareaRef = useRef(null);
    const [editingCommentId, setEditingCommentId] = useState(null);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/comments');
            if (response.ok) {
                const result = await response.json();
                setComments(result.data);
            } else {
                console.error('Failed to fetch comments');
            }
        } catch (error) {
            console.error('Error:', error);
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
                    response = await axios.post('/api/comments', {text:comment });
                }

                if (response.status === 200) {
                    const result = response.data.data;
                    console.log('Comment saved:', result);

                    fetchComments();

                    setComment("");

                    setEditingCommentId(null);

                    textareaRef.current.style.height = "40px";
                } else {
                    const errorText = await response.text();
                    console.error('Failed to save the comment', errorText);
                }
            } catch (error) {
                console.error('Error:', error);
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
            const response = await fetch(`http://localhost:5050/api/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
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
        setEditingCommentId(id);
        setComment(text);
        textareaRef.current.focus();
        //console.log('Edit button clicked');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Comment
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <textarea
                            ref={textareaRef}
                            value={comment}
                            onChange={handleChange}
                            placeholder="Write a comment"
                            style={{
                                width: '80%',
                                marginRight: '8px',
                                resize: 'none',
                                overflow: 'hidden',
                                minHeight: '40px',
                                boxSizing:'border-box', 
                            }}
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