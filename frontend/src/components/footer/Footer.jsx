import React from 'react';

function Footer() {
    const whatsappNumber = "01724394274";
    const facebookUsername = "srabonti.talukdar03";
    const instagramUsername = "s_r_a_b_o_n_t_ii";
    const message = encodeURIComponent("Hey there! Welcome to Whispered Words 📚 - your go-to online bookstore! Let us know how we can help you find the perfect read or answer any questions. Happy reading!");

    return (
        <div className="bg-zinc-800 text-white px-8 py-8">
            <footer className="max-w-4xl mx-auto text-center">
                <div className="text-sm mt-4">
                    <p>Follow us on our social media channels to stay updated with the latest books and offers!</p>
                </div>

                {/* Social Media Icons */}
                <nav>
                    <div className="flex justify-center items-center gap-6 mt-4">
                        {/* WhatsApp Icon */}
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${message}`}
                            aria-label="WhatsApp"
                            className="hover:text-green-500 transition duration-300 p-2 rounded-full"
                            target="_blank"
                            rel="noopener noreferrer">
                            <svg fill="currentColor" width="28px" height="28px" viewBox="0 0 308 308">
                                <path d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458C233.168,179.508,230.845,178.393,227.904,176.981z" />
                                <path d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867C276.546,215.678,222.799,268.994,156.734,268.994z" />
                            </svg>
                        </a>

                        {/* Instagram Icon */}
                        <a
                            href={`https://www.instagram.com/${instagramUsername}/`}
                            aria-label="Instagram"
                            className="hover:text-pink-600 transition duration-300 p-2 rounded-full"
                            target="_blank"
                            rel="noopener noreferrer">
                            <svg fill="currentColor" width="28px" height="28px" viewBox="-30 -30 360 360">
                                <path d="M38.52,0.012h222.978C282.682,0.012,300,17.336,300,38.52v222.978c0,21.178-17.318,38.49-38.502,38.49H38.52c-21.184,0-38.52-17.313-38.52-38.49V38.52C0,17.336,17.336,0.012,38.52,0.012z M218.546,33.329c-7.438,0-13.505,6.091-13.505,13.525v32.314c0,7.437,6.067,13.514,13.505,13.514h33.903c7.426,0,13.506-6.077,13.506-13.514V46.854c0-7.434-6.08-13.525-13.506-13.525H218.546z M266.084,126.868h-26.396c2.503,8.175,3.86,16.943,3.86,26.049c0,36.546-29.903,66.444-66.444,66.444c-36.546,0-66.444-29.898-66.444-66.444c0-9.106,1.357-17.874,3.86-26.049h-26.396c-9.356,0-17.006,7.647-17.006,17.006v26.077c0,1.59,0.365,3.107,1.04,4.545c-5.869,20.019-9.057,41.075-9.057,62.684c0,9.358,7.652,17.005,17.006,17.005h26.396c-2.267-8.663-3.53-17.592-3.53-26.722c0-36.546,29.903-66.444,66.444-66.444c36.541,0,66.444,29.898,66.444,66.444c0,9.13-1.264,18.059-3.53,26.722h26.396c9.358,0,17.006-7.647,17.006-17.005v-26.077C283.09,134.515,275.44,126.868,266.084,126.868z" />
                            </svg>
                        </a>

                        {/* Facebook Icon */}
                        <a
                            href={`https://www.facebook.com/${facebookUsername}/`}
                            aria-label="Facebook"
                            className="hover:text-blue-600 transition duration-300 p-2 rounded-full"
                            target="_blank"
                            rel="noopener noreferrer">
                            <svg fill="currentColor" width="28px" height="28px" viewBox="0 0 24 24">
                                <path d="M12,2.04c-5.522,0-10,4.478-10,10.002c0,4.993,3.657,9.128,8.438,9.886v-6.993H8.128v-2.895h2.309v-2.194c0-2.295,1.064-4.464,4.433-4.464c1.198,0,2.559,0.203,2.559,0.203v2.869h-1.444c-1.194,0-1.561,0.739-1.561,1.496v1.79h2.809l-0.448,2.895h-2.361v6.993c4.78-0.758,8.438-4.892,8.438-9.886C22,6.518,17.522,2.04,12,2.04z" />
                            </svg>
                        </a>
                    </div>
                </nav>

                <div className="mt-4 text-sm">
                    <p>Contact us: <a href="mailto:srabonti.talukdar2003@gmail.com" className="text-white underline">srabonti.talukdar2003@gmail.com</a></p>
                </div>

                <div className="mt-4 text-xs">
                    <p>&copy; 2024 Whispered Words. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
