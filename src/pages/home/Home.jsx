import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import "./home.scss";

const socket = io('https://chat-b-nine.vercel.app');

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Načíst dostupné servery při načtení komponenty
        const fetchRooms = async () => {
            try {
                const response = await axios.get('https://chat-b-nine.vercel.app/api/rooms'); // Opravená cesta k API
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();

        // Aktualizace seznamu serverů, když se vytvoří nový server
        socket.on('update_rooms', (rooms) => {
            setRooms(rooms);
        });

        // Čistící funkce pro odstranění event listeneru
        return () => {
            socket.off('update_rooms');
        };
    }, []);

    const createRoom = () => {
        if (roomName) {
            socket.emit('create_room', roomName);
            navigate(`/room/${roomName}`);
        }
    };

    const joinRoom = (room) => {
        navigate(`/room/${room}`);
    };

    return (
        <div className="home-container">
            <h1>Chat App</h1>
            <div>
                <input
                    type="text"
                    placeholder="Server Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button onClick={createRoom}>Create Server</button>
            </div>
    
            <h2>Available Servers</h2>
            <ul>
                {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                        <li key={index} onClick={() => joinRoom(room)} style={{ cursor: 'pointer' }}>
                            {room}
                        </li>
                    ))
                ) : (
                    <li>No available servers</li>
                )}
            </ul>
        </div>
    );
};

export default Home;
