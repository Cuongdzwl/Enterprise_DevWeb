import React from 'react';
import {Chart as ChartJS, defaults} from "chart.js/auto";
import {Bar, Doughnut, Line} from 'react-chartjs-2';
import useFetch from "../../CustomHooks/useFetch.jsx";
import {ApiResponse} from "../../Api.js";
import Loading from "../../components/Loading.jsx";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";


const ManagerDashboard = () => {
    const {data: dataSource} = useFetch(`${ApiResponse}faculties/{id}/dashboardManager?startYear=2023&endYear=2024`);

    if (!dataSource) {
        return <Loading/>
    }


    // Data for the chart
    const newData = dataSource.map(item => ({
        "Year": item.Year,
        "TotalEventLabel": `Total Event of ${item.Year}`,
        "TotalEvent": item.TotalEvent,
        "TotalContributionLabel": `Total Contribution of ${item.Year}`,
        "TotalContribution": item.TotalContribution
    }));


    const labels = newData.map(item => item.Year);
    const totalEvents = newData.map(item => item.TotalEvent);
    const totalContributions = newData.map(item => item.TotalContribution);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Total Event',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
                hoverBorderColor: 'rgba(54, 162, 235, 1)',
                data: totalEvents
            },
            {
                label: 'Total Contribution',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
                hoverBorderColor: 'rgba(255, 99, 132, 1)',
                data: totalContributions
            }
        ]
    };

    const options = {
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Year'
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Total'
                }
            }
        },
        plugins: {
            title: {
                text: "Total Event and Total Contribution by Year",
            },
        },
    };

    // Handle Report
    const handleReport = async () => {
        try {
            const response = await fetch(`${ApiResponse}faculties/report`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download contribution');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'faculty_all_lifetime.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='box'>
                <div className="row-1">
                    <div className="header">
                        <div className="title">Manager Dashboard</div>
                    </div>
                    <div className="create">
                        <button className="custom-button" onClick={handleReport}>Generate Report</button>
                    </div>
                </div>

                <div className="dashboard coodinator">
                    <div className="dataCard revenueCard">
                        <Bar data={data} options={options} />
                    </div>
                </div>
            </div>
        </>
    );

};

export default ManagerDashboard;