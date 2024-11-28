import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import './Chat.css';

interface Message {
    sender: string;
    text: string;
    time: string;
}

interface Patient {
    name: string;
    referredTo: string;
    messages: Message[];
}

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [messageText, setMessageText] = useState('');

    // Dummy data to simulate the patient data
    const patientList: Patient[] = [
        {
            name: 'Ler',
            referredTo: 'Bhuvin Singla',
            messages: [
                { sender: 'Rina Waller', text: 'Hello 555', time: '9 days ago' },
                { sender: 'Sujal Anand', text: 'Hello', time: '11 days ago' },
                { sender: 'Rina Waller', text: 'hii', time: '14 hours ago' },
                { sender: 'Sujal Anand', text: 'hello', time: '14 hours ago' },
            ],
        },
        {
            name: 'park',
            referredTo: 'Langles',
            messages: [
                { sender: 'Hedwig Clark', text: 'How are you?', time: '1 hour ago' },
                { sender: 'Sidhu Mosse wala', text: 'I am fine, thank you.', time: '30 minutes ago' },
            ],
        },
    ];

    useEffect(() => {
        setPatients(patientList);
    }, []);

    const handleSendMessage = (values: { message: string }) => {
        if (selectedPatient) {
            const newMessage: Message = {
                sender: 'You',
                text: values.message,
                time: 'Just now',
            };
            const updatedPatient = {
                ...selectedPatient,
                messages: [...selectedPatient.messages, newMessage],
            };
            setPatients((prevPatients) =>
                prevPatients.map((patient) =>
                    patient.name === selectedPatient.name ? updatedPatient : patient
                )
            );
            setMessageText('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Search Patient</h2>
                <input type="text" placeholder="Search Patient" />
                <div className="patient-list">
                    {patients.map((patient) => (
                        <div
                            key={patient.name}
                            className={`patient-item ${selectedPatient?.name === patient.name ? 'selected' : ''}`}
                            onClick={() => setSelectedPatient(patient)}
                        >
                            <span>{patient.name}</span>
                            <span className="referred-to">Referred To: {patient.referredTo}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-window">
                {selectedPatient ? (
                    <>
                        <h3>{selectedPatient.name}</h3>
                        <div className="messages">
                            {selectedPatient.messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}
                                >
                                    <div className="message-text">{message.text}</div>
                                    <div className="message-time">{message.time}</div>
                                </div>
                            ))}
                        </div>
                        <Formik
                            initialValues={{ message: messageText }}
                            onSubmit={handleSendMessage}
                        >
                            {({ values, handleChange, handleBlur }) => (
                                <Form className="message-input-form">
                                    <Field
                                        name="message"
                                        type="text"
                                        placeholder="Type your message here..."
                                        value={values.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="message-input"
                                    />
                                    <button type="submit" className="send-btn">
                                        Send
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </>
                ) : (
                    <div className="no-patient-selected">Select a patient to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default Chat;
