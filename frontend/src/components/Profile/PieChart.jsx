import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6F61',
  '#FF6347', '#6A5ACD', '#FFD700', '#32CD32', '#8A2BE2', '#FF4500',
  '#00BFFF', '#DC143C', '#7FFF00', '#FF1493'
];

function GenrePieChart() {
    const [genreData, setGenreData] = useState([]);

    useEffect(() => {
        const fetchGenreCounts = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/v1/booksbygenre");
                const formattedData = response.data.data.map(item => ({
                    name: item._id,
                    value: item.count,
                }));
                setGenreData(formattedData);
            } catch (error) {
                console.error("Error fetching genre counts:", error);
            }
        };

        fetchGenreCounts();
    }, []);

    const totalBooks = genreData.reduce((acc, item) => acc + item.value, 0);

    const formattedData = genreData.map(item => ({
        ...item,
        percentage: ((item.value / totalBooks) * 100).toFixed(2),
    }));

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'left' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {formattedData.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '5px',
                                fontSize: '15px',
                                fontWeight: 'semibold',
                            }}
                        >
                            <div
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: COLORS[index % COLORS.length],
                                    marginRight: '10px',
                                }}
                            ></div>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            {genreData.length > 0 ? (
                <div style={{ marginTop: '20px' }}>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={formattedData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                        >
                            {genreData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name, entry) => `${entry.payload.percentage}%`} />
                    </PieChart>
                </div>
            ) : (
                <p>Loading chart data...</p>
            )}
        </div>
    );
}

export default GenrePieChart;
