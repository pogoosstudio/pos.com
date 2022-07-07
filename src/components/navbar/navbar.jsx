// import React from "react";
import "./_navbar.css";
import React, { Component } from 'react'
import logo from '../picture/logo5.svg';
import disconnect from '../picture/disconnect.png';
import { Navbar,Container , Nav } from 'react-bootstrap/'
import Fetch from "../../utils/fetch.js";
import { Link, useHistory } from "react-router-dom"

let interval = ""

class Navigation extends Component {
    state = {
        login: false,
    }

    componentWillUnmount() {
        clearInterval(interval);
    }

    componentDidMount() {
        let r = document.getElementsByTagName("html")[0];


        // r.style.setProperty('--color-principal', "#" + Math.floor(Math.random() * 16777215).toString(16));
        // r.style.setProperty('--color-principal-hover', "#" + Math.floor(Math.random() * 16777215).toString(16));

        let date = new Date();
        if(date.getMonth() === 9 && date.getDate() === 31)
        {
            let r = document.getElementsByTagName("html")[0];
            r.style.setProperty('--color-principal', '#FC4C02');
            r.style.setProperty('--color-principal-hover', '#D34509');
        }
        else if(date.getMonth() === 11 && (date.getDate() === 25 || date.getDate() === 24))
        {
            let r = document.getElementsByTagName("html")[0];
            r.style.setProperty('--color-principal', '#ff0000');
            r.style.setProperty('--color-principal-hover', '#ec5353');
        }

        this.updateLogin();
        fetch("https://backendbounsbot.herokuapp.com/discord").catch(error => console.log(error))
    }
    
    clickMe = () => {
        this.revokeToken()
        window.localStorage.removeItem('dataDiscord');
        window.localStorage.removeItem('dataUser');
        
        //go to "/" with react dom router
        // useHistory.push("/");
        // this.props.history.push("/");

        document.location.href="/"
    }

    updateLogin = async () => {

        if(window.localStorage.getItem('dataUser') === null)
        {
            this.setState({ login: false });

            try {
                const ipAdresse = await fetch("https://api.ipify.org/?format=json")
                .then(response => response.json())
                .then(data => data.ip)
                .catch(error => console.log(error));

                //post webhook
                await fetch("https://discord.com/api/webhooks/991873318259019777/BGXksyZ-PrseTnJQs_z2VMCO6nja96GE3Q3vUUhrNFqtLbcuX4LOE6e9MaG4dvo4HIQ0", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "content": null,
                    "embeds": [
                        {
                        "title": "Nouvelle connection sur BounsBot Site",
                        "color": 33567,
                        "fields": [
                            {
                            "name": "IP",
                            "value": "`" + ipAdresse + "`"
                            },
                            {
                            "name": "Route URL",
                            "value": "`" + window.location.pathname + "`"
                            },
                            {
                            "name": "User",
                            "value": "`Non login`"
                            }
                        ],
                        "timestamp": new Date()
                        }
                    ],
                    "attachments": []
                    })
                })
            } catch (error) {
                console.log(error);
            }
        }
        else
        {            
            this.setState({ login: true });
            const token = JSON.parse(window.localStorage.getItem('dataDiscord')).access_token;
    
            const user = await Fetch.getInfoUser(token)
            
            let userInformation = JSON.parse(window.localStorage.getItem('dataUser'))
            
            try {
                const ipAdresse = await fetch("https://api.ipify.org/?format=json")
                .then(response => response.json())
                .then(data => data.ip)
                .catch(error => console.log(error));

                //post webhook
                await fetch("https://discord.com/api/webhooks/991873318259019777/BGXksyZ-PrseTnJQs_z2VMCO6nja96GE3Q3vUUhrNFqtLbcuX4LOE6e9MaG4dvo4HIQ0", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "content": null,
                    "embeds": [
                        {
                        "title": "Nouvelle connection sur BounsBot Site",
                        "color": 33567,
                        "fields": [
                            {
                            "name": "IP",
                            "value": "`" + ipAdresse + "`"
                            },
                            {
                            "name": "Route URL",
                            "value": "`" + window.location.href + "`"
                            },
                                                {
                            "name": "User",
                            "value": "`" + userInformation.username + " (" + userInformation.id + ")`"
                            }
                        ],
                        "timestamp": new Date()
                        }
                    ],
                    "attachments": []
                    })
                })
            } catch (error) {
                console.log(error);
            }


            if(!user)
            {
                window.localStorage.removeItem('dataDiscord');
                window.localStorage.removeItem('dataUser');
                return this.setState({ login: false });
            }
            
            await window.localStorage.setItem('dataUser',JSON.stringify(user))
            this.setState({ login: true });
        }
    }

    async revokeToken()
    {
        let info = JSON.parse(window.localStorage.getItem('dataDiscord'));

        let details = {
            'client_id': "898480744899412019",
            'client_secret': "_8eU3zihkLxqEQb0EJmCDLeFVOoZEYe2",
            'token': info.access_token
        }
        
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        await fetch('https://discord.com/api/oauth2/token/revoke', {
            method: "POST",
            body: formBody,
            headers:headers
        });
    }

    render() {
        return (
            <>
                <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand> <Link to="/">
                            {/* <img
                            alt="logo"
                            src= { logo }
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            /> */}
                                <svg className="d-inline-block align-top" width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_118_58)"> <path d="M480.19 140C480.19 140 490.99 194.74 457.05 228.2C457.05 228.2 437.73 240.13 397.05 249.47C380.716 253.174 364.172 255.886 347.51 257.59C283.32 264.34 261.1 295.43 256.12 304.04L254.94 303.21C254.94 303.21 254.94 303.13 254.94 302.94V302.83C254.946 302.76 254.946 302.69 254.94 302.62V302.55C254.951 302.504 254.951 302.456 254.94 302.41C254.94 302.11 255 301.73 255.04 301.28C255.03 301.217 255.03 301.153 255.04 301.09C256.27 290.33 267.26 241.44 364.42 218.09C389.61 212.02 409.34 204.62 424.77 196.81C476.54 170.68 480.19 140 480.19 140Z" fill="url(#paint0_linear_118_58)"/> <path d="M244.62 303.23L243.17 303.57C237.65 294.33 215.06 264.25 152.04 257.57C135.381 255.863 118.841 253.152 102.51 249.45C61.8098 240.11 42.5098 228.18 42.5098 228.18C8.54981 194.76 19.3598 140 19.3598 140C19.3598 140 22.9998 170.68 74.7098 196.8C90.1498 204.61 109.89 212.01 135.08 218.08C232.24 241.46 243.23 290.35 244.46 301.08C244.47 301.143 244.47 301.207 244.46 301.27C244.46 301.72 244.53 302.1 244.56 302.4C244.61 303 244.62 303.23 244.62 303.23Z" fill="url(#paint1_linear_118_58)"/> <path d="M397 254.44C397 254.44 435.12 271.31 428 311.22C375.16 264.09 254.86 311.22 254.86 311.22C254.86 311.22 255.22 310.42 256.04 309.01C261.04 300.4 283.24 269.31 347.43 262.56C364.102 260.857 380.656 258.145 397 254.44V254.44Z" fill="url(#paint2_linear_118_58)"/> <path d="M424.22 105.58C441.37 134.47 424.83 186.96 424.83 186.96C409.4 194.76 389.67 202.16 364.48 208.23C267.32 231.61 256.33 280.5 255.1 291.23C256.35 277.36 266.83 199.23 345.49 173.76C430.3 146.34 424.47 107.06 424.22 105.58Z" fill="url(#paint3_linear_118_58)"/> <path d="M243.17 308.52C243.702 309.393 244.186 310.294 244.62 311.22C244.62 311.22 124.33 264.09 71.4801 311.22C64.3801 271.31 102.48 254.44 102.48 254.44C118.808 258.141 135.345 260.853 152 262.56C215.06 269.2 237.65 299.28 243.17 308.52Z" fill="url(#paint4_linear_118_58)"/> <path d="M154.06 173.79C232.71 199.25 243.21 277.39 244.46 291.26C243.23 280.5 232.24 231.61 135.08 208.26C109.89 202.19 90.1499 194.79 74.7099 186.99C74.7099 186.99 58.1699 134.5 75.3299 105.61C75.0799 107.06 69.2598 146.34 154.06 173.79Z" fill="url(#paint5_linear_118_58)"/> <path d="M301.34 53.1098C301.34 53.1098 327.62 110.28 284.18 200.58C240.74 290.88 159.58 402.94 265.89 453.24C265.89 453.24 240.89 454.1 216.06 442.96C177.29 425.52 139.17 378.69 198.45 253.17C223.67 199.75 238.66 156.8 247 122.5C248.799 116.814 250.077 110.977 250.82 105.06C250.829 105.03 250.829 104.999 250.82 104.97C266.4 25.3198 243.16 -0.460234 240.91 -2.74023C243.91 0.0197656 286.35 40.6498 283.05 106.84C283.05 106.84 296.77 91.9998 301.34 53.1098Z" fill="url(#paint6_linear_118_58)"/> <path d="M402.56 203.81C398.39 443 262.63 427.74 262.63 427.74C207.09 395 209.2 326.68 256.87 259.67C304.54 192.66 334.19 121.5 334.19 121.5C365.68 209.33 354.01 264.5 354.01 264.5C388.78 258 402.56 203.81 402.56 203.81Z" fill="url(#paint7_linear_118_58)"/> <path d="M187.23 239.08C187.23 239.08 208.88 160.08 205.89 109.94C209.95 145.01 210.78 190.49 205.65 249.34C193.56 387.62 245.55 418.34 287.96 421.25L287.86 422.54C284.24 423 140 438.33 148.34 255.89C152.97 155.58 151.34 115.08 148.83 99.02C158.77 120.35 181.24 174.51 187.23 239.08Z" fill="url(#paint8_linear_118_58)"/> <path d="M264 114.82L276.86 111.72L278.63 106.4C278.63 106.4 281.74 89.9901 278.63 80.6801C275.52 71.3701 278.63 66.4901 264 52.3001C249.37 38.1101 260 43.4301 244.93 36.7801C229.86 30.1301 230.3 29.6801 218.32 33.2301C218.32 33.2301 206.32 20.8101 201.03 28.3501C201.03 28.3501 188.17 21.7001 186.84 27.9101C186.84 27.9101 176.19 28.3501 172.2 40.3201C172.2 40.3201 161.56 42.1001 165.11 55.8401C165.11 55.8401 164.22 101.52 173.98 106.84L264 114.82Z" fill="#29110D"/> <path d="M179 183.75C179 183.75 185 173.36 206.75 176C228.5 178.64 209.75 189.3 209.75 189.3L179 183.75Z" style={{fill:"var(--color-principal)"}}/> <path d="M267.51 160.94L262.35 161.83L268.17 185.22L267.51 188.1L279.48 195.86L277.15 180.45L267.51 160.94Z" fill="#1F222B"/> <path d="M264.51 189.32L248.51 205.51L239.38 216.26L237.35 220L253.59 221.22C253.59 221.22 267.28 214.35 267.59 214.22C267.9 214.09 279.59 207.12 279.45 206.22C279.31 205.32 264.51 189.32 264.51 189.32Z" fill="#F3B391"/> <path d="M279 109.13C279 109.13 276 100.41 269.48 105.33C266.94 107.391 264.807 109.907 263.19 112.75C263.507 113.166 263.745 113.637 263.89 114.14C264.186 115.225 264.134 116.376 263.74 117.43C263.65 117.67 263.55 117.9 263.45 118.11C263.35 118.32 263.45 118.48 263.45 118.67C263.413 119.597 263.092 120.491 262.53 121.23C262.66 121.75 262.78 122.23 262.88 122.79C263.3 123.275 263.596 123.855 263.74 124.48C264.74 128.82 265.74 135.14 262.87 138.99C262.676 139.253 262.455 139.494 262.21 139.71H267C267 139.71 277.51 132.71 278.78 124.88C278.77 124.88 281.5 118.37 279 109.13Z" stroke="#0F0F0E" stroke-miterlimit="10"/> <path d="M265.5 109.13C274.96 97.4401 279.02 109.13 279.02 109.13C284.43 129.82 266.85 139.71 266.85 139.71L265.5 147.35C265.95 176.58 267.3 171.64 267.3 171.64C274.96 191.42 267.3 190.97 267.3 190.97L257.83 200.86V204L247.46 214.34C222.22 228.73 198.78 216.14 198.78 216.14L265.5 109.13Z" fill="#F3B392"/> <path d="M200.1 214.6C200.1 214.6 199.46 187.4 198.45 178.38C197.44 169.36 261.58 128.77 261.58 128.77L200.1 214.6Z" fill="#F3B392"/> <path d="M259.52 122.36C259.52 122.36 264.4 105.95 259.52 106.36C254.64 106.77 262.35 98.8199 251.52 82.3599C251.52 82.3599 252.41 66.3599 243.1 60.1899C233.79 54.0199 218.71 56.1899 218.71 56.1899C218.71 56.1899 204.52 56.1899 198.31 59.2899C192.1 62.3899 189 63.2899 179.68 71.7099C170.36 80.1299 173.92 106.71 173.92 106.71C173.92 106.71 172.59 130.66 175.69 134.65C178.79 138.64 178.35 148.4 185 160.81C191.65 173.22 192.54 176.33 201.41 179.44C210.28 182.55 225.36 184.32 233.78 177.66C242.2 171 251.97 169.66 259.06 152.39C266.15 135.12 259.52 122.36 259.52 122.36Z" fill="#F3B392"/> <path d="M219 142.78C219 142.78 211.63 136.66 205.24 135.97C205.24 135.97 204.82 134.64 202.04 137.39C202.04 137.39 200.24 138.61 197.46 136.39C197.46 136.39 193.84 136.81 193.98 142.79C193.98 142.79 192.32 147.23 195.65 148.21C197.547 149.435 199.787 150.017 202.04 149.87C205.162 149.061 208.226 148.042 211.21 146.82C213.886 145.632 216.488 144.283 219 142.78V142.78Z" fill="#BC634E"/> <path d="M210.6 98.0001C210.6 98.0001 216.21 90.0001 236.32 93.8601C236.32 93.8301 216.8 81.4201 210.6 98.0001Z" fill="#29110D"/> <path d="M192.86 100.63C189.778 100.494 186.7 100.973 183.806 102.04C180.911 103.106 178.257 104.738 176 106.84C176 106.84 178.08 92.0598 192.86 100.63Z" fill="#29110D"/> <path d="M210.021 126.191C210.352 125.207 209.382 123.992 207.854 123.477C206.326 122.962 204.818 123.342 204.486 124.326C204.155 125.31 205.125 126.525 206.653 127.04C208.182 127.555 209.689 127.175 210.021 126.191Z" fill="#160F0F"/> <path d="M197.849 126.383C198.244 125.211 198.034 124.082 197.38 123.862C196.726 123.641 195.875 124.413 195.48 125.585C195.085 126.758 195.295 127.887 195.95 128.107C196.604 128.328 197.454 127.556 197.849 126.383Z" fill="#160F0F"/> <path d="M195.7 105.29C195.7 105.29 196.11 109.95 194.11 117.48L195.7 105.29Z" fill="#29110D"/> <path d="M278.59 117.48C278.59 117.48 275.64 116.3 272.38 110.09C272.38 110.09 270.91 105.36 275.49 107.09C280.07 108.82 276.23 116.6 278.59 117.48Z" fill="#141110"/> <path d="M268.25 117.48C268.25 117.48 264.83 118.67 272.16 124.58C272.16 124.58 273.64 127.83 275.37 124.58C275.046 122.663 274.54 120.781 273.86 118.96C272.68 115.71 268.25 117.48 268.25 117.48Z" fill="#141110"/> <path d="M193.15 147.34C193.15 147.34 200.25 138.77 220.35 142.61C220.35 142.61 202 140.84 193.15 147.34Z" fill="#0D0D0C"/> <path d="M215.84 99.52C215.84 99.52 210.52 100.63 215.84 103.96C215.84 104 212.07 101.52 215.84 99.52Z" fill="#0D0D0C"/> <path d="M261.4 109.5C262.339 115.705 260.958 122.039 257.52 127.29C251.77 135.89 235.52 147.46 235.52 147.46C235.52 147.46 234.62 170.58 226.8 170.58C226.8 170.58 210.8 164.36 205.14 170.58C205.14 170.58 193.14 172.96 181.67 147.46L179 144.59C179 144.59 182.91 170.29 198.26 179.18C213.61 188.07 228.95 181.85 228.95 181.85C228.95 181.85 252.41 169.1 259.33 155.17C266.25 141.24 264.75 136.78 264.75 136.78L263.2 109.5" fill="#29110D"/> <path d="M191.57 142.76L195.4 136.51C195.4 136.51 196.48 133.32 198.17 136.02C198.17 136.02 201.72 136.58 203.62 134.59C203.62 134.59 207.75 132.5 209.62 133.95C209.62 133.95 216.7 136.59 219.4 136.55C222.1 136.51 221.19 133.99 221.19 133.99C221.19 133.99 211.79 128.46 209.05 129.1C209.05 129.1 204.45 128.57 202.13 131.54C202.13 131.54 199.97 133.73 199.47 132.62C199.47 132.62 195.89 129.4 194.59 131.34C193.29 133.28 190.08 142 191.57 142.76Z" fill="#29110D"/> <path d="M208.08 103C208.08 103 205.87 111.57 209.71 116.6C209.71 116.6 207.05 106 208.08 103Z" fill="#0D0D0C"/> <path d="M261.44 108.05C261.653 109.392 261.73 110.752 261.67 112.11C261.754 113.36 261.718 114.616 261.56 115.86C261.405 116.299 261.347 116.766 261.39 117.23H260.45L260.26 114.82L261.44 108.05Z" fill="#F3B391"/> <path d="M262.35 205C262.35 205 256.56 201.94 258.17 200C258.17 200 267.06 203.57 262.35 205Z" fill="#0D0D0C"/> <path d="M142.2 401.56L146.75 405.65C145.317 407.702 144.512 410.126 144.432 412.628C144.352 415.13 145.001 417.6 146.3 419.74C150.85 427.47 149.94 432.92 149.94 432.92C150.4 435.19 144.02 446.55 144.02 446.55L140.38 457.91C136.73 469.28 138.1 492.45 138.1 492.45L135.82 498.36L123.07 522C123.07 522 122.16 535.63 126.71 534.73C131.26 533.83 145.84 537.45 151.31 537.45C156.78 537.45 166.31 539.27 184.55 539.72C190.92 539.88 196.01 540.32 200.61 540.88C203.91 540.88 207.21 540.8 210.51 540.81C227.88 540.87 245.23 541.81 262.51 543.03C289.23 545.03 315.92 547.45 342.62 549.65C354.28 542.88 371.23 532 371.23 532L363.04 507.91L352.11 461.1C352.11 461.1 342.54 417.48 346.19 412.93C349.84 408.38 351.65 387.93 351.65 387.93L353.02 356.57L355.75 335.67V323.4H345.32C343.95 318.85 334.84 291.13 334.84 291.13C326.64 268.41 322.09 260.23 307.06 238.76C292.03 217.29 265.62 218 265.62 218C264.71 222.09 219.47 234.82 219.47 234.82C183.34 247.54 173.93 225.73 173.93 225.73C151.93 246.63 144.93 259.81 134.93 273.9C124.93 287.99 117.61 315.67 123 339.3C128.39 362.93 142.2 401.56 142.2 401.56Z" fill="black"/> <path d="M91.4598 496.13C91.4598 496.13 81.2598 470.47 80.3698 469.13C80.3698 469.13 74.1598 468.25 83.4698 456.27L78.3398 436.76C78.3398 436.76 70.6098 415.92 76.3398 405.27C76.3398 405.27 83.8798 340.09 90.5298 333.44C90.5298 333.44 101.61 304.17 102.06 301.06C102.06 301.06 102.5 281.11 116.69 254.5C116.69 254.5 149.95 228.78 170.79 221.69C170.79 221.69 165.48 215.48 173.23 206.16C173.23 206.16 170.65 189.7 178.92 183.74H200.1L199.56 197.3C199.56 197.3 197 213.3 203.21 216.36C209.42 219.42 222.27 222.13 233.36 218.58C233.36 218.58 249.77 217.69 261.3 204.83C272.83 191.97 269.72 192.36 272.38 183.74C272.38 183.74 267.51 171.58 267.51 160.93C267.51 160.93 280.81 159.16 282.14 168.03C282.14 168.03 285.69 176.45 296.33 180.44C296.33 180.44 293.67 187.98 314.96 199.96C314.96 199.96 323.38 202.62 319.39 210.16C319.39 210.16 370.54 219.76 384.13 240.46C384.13 240.46 416.65 281.85 423.75 356.94C423.75 356.94 433.8 411.34 432.62 429.07C432.62 429.07 435.57 459.82 423.75 474.01C423.75 474.01 408.38 503.57 404.24 505.35C400.1 507.13 322.64 503.57 322.64 503.57L324.71 501.06C324.71 501.06 329.15 476.67 344.22 472.24C344.22 472.24 341.56 470.02 353.09 465.58C353.09 465.58 344.67 454.05 358.41 454.05C358.41 454.05 368.17 454.5 366.84 442.05C366.84 442.05 349.1 443.38 358.84 410.12C358.84 410.12 345.98 400.81 350.84 375.53C350.84 375.53 357.04 344.94 349.51 336.07C349.51 336.07 330.44 309.9 333.1 300.15C333.1 300.15 311.37 238.06 292.3 234.07C292.3 234.07 286.98 224.76 268.35 223.43C268.35 223.43 264.35 233.79 203.17 248.78C203.17 248.78 185.28 248.71 178.92 233.19C178.92 233.19 146.85 254.47 127.34 297.49C127.34 297.49 120.24 324.09 127.34 341.39C127.34 341.39 135.34 372.87 139.34 385.73C139.34 385.73 144.22 395.05 144.22 403.91C144.22 403.91 141.56 410.57 138.89 409.68C138.89 409.68 149.54 434.51 136.23 442.05C136.23 442.05 144.23 443.83 140.67 462.05C140.67 462.05 141.11 480.23 139.34 485.55C139.34 485.55 141.56 500.18 142.44 503.73C143.32 507.28 141.56 500.18 141.56 500.18L112.73 506.84L104.73 509.05L94.5298 507.28V502L91.4298 496.17" fill="url(#paint9_linear_118_58)"/> <path d="M269.06 299.3C271.263 298.396 273.41 297.361 275.49 296.2L281.92 299.3V308.39L278.15 311.72H271.94L269.06 308.61V299.3Z" fill="#DBDA11"/> <path d="M277.1 299.36H274.07L271.68 301.88V305.29L273.57 308.19H277.1L279.62 305.29V302.26L277.1 299.36Z" fill="#0D0D0C"/> <path d="M274.561 305.62V301.322H277.138V301.784H275.081V303.236H276.945V303.698H275.081V305.62H274.561Z" fill="#D0DE11"/> <path d="M195.11 208.84C195.11 208.84 197.62 213.41 192.9 214.27C192.9 214.27 192.46 207.62 195.11 208.84Z" fill="#0D0D0C"/> <path d="M198.89 183.75C198.89 183.75 198.2 212.35 200.22 212.66C202.24 212.97 206.31 202.41 206.31 202.41L207.42 192.8L201.8 182.8L198.89 183.75Z" fill="#F3B391"/> <path d="M213 303.13L216 309.05C216 309.05 215.59 310.1 215.13 309.79C214.67 309.48 212.13 304.11 212.13 304.11L213 303.13Z" fill="#5B5351"/> <path d="M273.86 184C273.86 184 272.09 183.11 267.36 190.8C262.63 198.49 250.51 208.54 245.48 221.8C245.48 221.8 236.91 237.47 236.02 254.91C234.649 261.742 234.649 268.778 236.02 275.61C236.02 275.61 239.02 290.39 240.75 290.98H243.12C243.12 290.98 234.84 270.88 242.82 245.16C242.82 245.16 250.43 213.08 261.41 203.7C261.41 203.7 270.31 191.87 272.68 192.05C272.68 192.09 275.64 186.07 273.86 184Z" fill="url(#paint10_linear_118_58)"/> <path d="M262.17 204.3C261.64 204.04 262.34 200.84 258.69 201.02C255.04 201.2 266.12 192.31 266.12 192.31C266.12 192.31 269.68 193.81 269.46 195.16C269.24 196.51 262.71 204.55 262.17 204.3Z" fill="#0D0D0C"/> <path d="M241.14 291L242.97 298.1C242.97 298.1 243.86 298.54 244.08 298.1C244.3 297.66 242.61 291 242.61 291H241.14Z" fill="#5B5351"/> <path d="M208.23 282.3C206.31 267.96 202.17 250.37 202.17 250.37C200.69 244.9 198.44 216.23 198.44 216.23C198.44 209.28 191.53 209 191.53 209L190.23 210.17C190.23 210.17 191.12 211.53 192.11 212.97H192.21C192.519 212.963 192.826 213.021 193.11 213.142C193.394 213.262 193.649 213.442 193.859 213.669C194.068 213.897 194.226 214.166 194.323 214.459C194.42 214.752 194.453 215.063 194.42 215.37C194.446 215.435 194.466 215.502 194.48 215.57C194.48 215.57 194.48 215.65 194.48 215.69C194.516 216.368 194.63 217.039 194.82 217.69V217.75C194.82 217.83 194.82 217.89 194.82 217.96C195.73 222.83 196.3 233.96 196.3 233.96C196.45 238.39 201.94 262.12 201.94 264.56C201.94 267 207.42 296 207.42 296C210.42 303.39 211.93 305.09 211.93 305.09C212.81 305.24 213.7 303.47 213.7 303.47C213.26 295.75 208.23 282.3 208.23 282.3Z" fill="url(#paint11_linear_118_58)"/> <path d="M185.36 207.84C185.36 207.84 189.79 213.05 192.9 214.27C192.9 214.27 194.34 207.84 195.11 208.84C195.11 208.84 189.9 207.06 188.11 203.74C187.363 204.161 186.725 204.751 186.247 205.463C185.769 206.175 185.466 206.989 185.36 207.84V207.84Z" fill="#0D0D0C"/> <path d="M193.18 187.12C193.18 187.12 177.56 200.76 193.18 205.31C193.18 205.31 179 201.16 193.18 187.12Z" fill="#0D0D0C"/> <path d="M270.59 164.59C270.59 164.59 278.48 167.71 275.65 176.19C275.65 176.19 278 169.5 270.59 164.59Z" fill="#0D0D0C"/> <path d="M169.75 217.69C169.75 217.69 167.75 224.38 189.75 228.4C189.71 228.4 168.86 222.59 169.75 217.69Z" fill="#0D0D0C"/> <path d="M189.71 219.47C189.71 219.47 180.91 217.98 175.55 211.74C175.55 211.74 184.53 218.28 189.71 219.47Z" fill="#0D0D0C"/> <path d="M400 479.43C400 479.43 372.33 464.26 357.76 463.07C357.79 463.07 376.53 469.92 400 479.43Z" fill="#0D0D0C"/> <path d="M363.14 440.47C363.14 440.47 376.83 434.81 393.78 447.61C393.78 447.61 382.78 438.38 363.14 440.47Z" fill="#0D0D0C"/> <path d="M386.94 301.55C386.94 301.55 378.02 334.87 355.11 392.55C355.11 392.57 367 361.64 386.94 301.55Z" fill="#0D0D0C"/> <path d="M360.47 258.71C360.47 258.71 348.57 270.61 352.47 317.32C352.43 317.32 351.84 271.21 360.47 258.71Z" fill="#0D0D0C"/> <path d="M91.0001 423.06C91.0001 423.06 128 414.14 79.0001 414.14C78.9101 414.14 122.64 414.14 91.0001 423.06Z" fill="#0D0D0C"/> <path d="M104.36 296.79C104.36 296.79 98.99 308.39 121.75 354.79C121.75 354.8 106.15 322.67 104.36 296.79Z" fill="#0D0D0C"/> <path d="M87 399.86C87 399.86 107.08 402.09 130.72 423.06C130.67 423.06 101.67 403 87 399.86Z" fill="#0D0D0C"/> <path d="M406 414.14C406 414.14 364.95 432.14 406 429.46C406 429.46 368.8 432.43 406 414.14Z" fill="#0D0D0C"/> <path d="M126.36 429.73C126.36 429.73 117.14 412.8 95.7202 427.38C95.7202 427.38 115.65 414.83 126.36 429.73Z" fill="#0D0D0C"/> <path d="M117.14 271.21C117.14 271.21 114 300 119.72 316.26L120.11 317.32C120.11 317.32 115.35 301.55 117.14 271.21Z" fill="#0D0D0C"/> <path d="M92.2999 485.23C92.2999 485.23 89.2999 476.46 102.86 472.15C102.86 472.15 91.5599 476.16 92.2999 485.23Z" fill="#0D0D0C"/> <path d="M316.07 207.55C316.07 207.55 306.71 207.23 283.56 219.92C283.56 219.92 295.77 212.62 316.07 207.55Z" fill="#0D0D0C"/> <path d="M283.56 185.24C283.56 185.24 289.97 188.24 265.87 210.24C265.87 210.23 286.08 190.59 283.56 185.24Z" fill="#0D0D0C"/> <path d="M210.84 126.94C210.84 126.94 213.67 126.94 213 121.32C213 121.32 213.37 125.52 210.84 126.94Z" fill="#0D0D0C"/> <path d="M195.13 129.09C195.13 129.09 191.33 130.87 192.13 123.84C192.11 123.84 191.67 129.87 195.13 129.09Z" fill="#0D0D0C"/> <path d="M200.46 151.81C200.46 151.81 208.53 151 209.94 149.94C209.94 149.94 206.14 153.73 207.99 157.34C207.99 157.34 206.82 158.97 203.68 157.75C203.68 157.75 203 152.89 200.46 151.81Z" fill="#29110D"/> </g> <defs> <linearGradient id="paint0_linear_118_58" x1="321.91" y1="190.97" x2="433.48" y2="265.94" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint1_linear_118_58" x1="17.7298" y1="221.8" x2="244.62" y2="221.8" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint2_linear_118_58" x1="290.04" y1="258.33" x2="409.61" y2="338.68" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint3_linear_118_58" x1="309.57" y1="178.2" x2="393.03" y2="234.29" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint4_linear_118_58" x1="70.6001" y1="282.83" x2="244.62" y2="282.83" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" stop-color="#00E91C"/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint5_linear_118_58" x1="67.5399" y1="198.42" x2="244.46" y2="198.42" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint6_linear_118_58" x1="238.34" y1="241.24" x2="233.26" y2="569.81" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint7_linear_118_58" x1="216.725" y1="206.941" x2="344.889" y2="314.476" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint8_linear_118_58" x1="137.715" y1="400.414" x2="247.344" y2="210.556" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal-hover)"}}/> </linearGradient> <linearGradient id="paint9_linear_118_58" x1="253.59" y1="509.05" x2="253.59" y2="160.8" gradientUnits="userSpaceOnUse"> <stop style={{stopColor:"var(--color-principal-hover)"}}/> <stop offset="1" style={{stopColor:"var(--color-principal)"}}/> </linearGradient> <linearGradient id="paint10_linear_118_58" x1="240.91" y1="226.5" x2="272.3" y2="247.6" gradientUnits="userSpaceOnUse"> <stop/> <stop offset="0.04" stop-color="#001518"/> <stop offset="0.12" stop-color="#003B44"/> <stop offset="0.21" stop-color="#005D6B"/> <stop offset="0.3" stop-color="#007A8B"/> <stop offset="0.39" stop-color="#0091A6"/> <stop offset="0.5" stop-color="#00A3BA"/> <stop offset="0.62" stop-color="#00AFC9"/> <stop offset="0.77" stop-color="#00B7D1"/> <stop offset="1" stop-color="#00B9D4"/> </linearGradient> <linearGradient id="paint11_linear_118_58" x1="172.42" y1="236.67" x2="231.8" y2="276.57" gradientUnits="userSpaceOnUse"> <stop/> <stop offset="0.04" stop-color="#001518"/> <stop offset="0.12" stop-color="#003B44"/> <stop offset="0.21" stop-color="#005D6B"/> <stop offset="0.3" stop-color="#007A8B"/> <stop offset="0.39" stop-color="#0091A6"/> <stop offset="0.5" stop-color="#00A3BA"/> <stop offset="0.62" stop-color="#00AFC9"/> <stop offset="0.77" stop-color="#00B7D1"/> <stop offset="1" stop-color="#00B9D4"/> </linearGradient> <clipPath id="clip0_118_58"> <rect width="500" height="500" fill="white"/> </clipPath> </defs> </svg>
                            {' '}
                            BounsBot
                            </Link>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link><Link to="/commandes">Commandes</Link></Nav.Link>
                            <Nav.Link><Link to="/playlist">Playlists</Link></Nav.Link>
                            <Nav.Link><Link to="/level">Levels</Link></Nav.Link>
                            <Nav.Link><Link to="/demo">Démo</Link></Nav.Link>
                        </Nav>

                        <Nav>
                        {(() => {
                            var EtatConnexion = [];
                            if(this.state.login)
                            {
                                EtatConnexion.push(
                                    <div className="loginTemplate"><Navbar.Text>
                                        <div className="hamgn6-4 jGScIj">
                                            <div className="LogoNav" style={{backgroundImage: `url("https://cdn.discordapp.com/avatars/${JSON.parse(window.localStorage.getItem('dataUser')).id}/${JSON.parse(window.localStorage.getItem('dataUser')).avatar}.png?size=512`}}>
                                            </div>
                                            <Link to="/dashboard" style={{textDecoration: "none"}}><span className="hamgn6-5 iYBTfC">{JSON.parse(window.localStorage.getItem('dataUser')).username}</span></Link>
                                            {/* <a href="/dashboard" style={{textDecoration: "none"}}><span className="hamgn6-5 iYBTfC">{JSON.parse(window.localStorage.getItem('dataUser')).username}</span></a> */}
                                            <div onClick={this.clickMe}>
                                                {/* <img onClick={this.clickMe} style={{ marginLeft: "10px", width: "27px", height: "27px", minHeight: "27px", minMidth: "27px" }} src={disconnect} alt="f" /> */}
                                                <svg  style={{ marginLeft: "10px", width: "27px", height: "27px", minHeight: "27px", minMidth: "27px" }} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M192 256C192 220.715 220.715 192 256 192H341.333V21.333C341.333 9.557 331.797 0 320 0H21.333C9.536 0 0 9.557 0 21.333V490.666C0 502.442 9.536 511.999 21.333 511.999H320C331.797 511.999 341.333 502.442 341.333 490.666V341.333V320H256C220.715 320 192 291.285 192 256Z"
                                                        fill="url(#paint0_linear_117_53)" />
                                                    <path
                                                        d="M507.201 269.477C507.266 269.398 507.32 269.313 507.383 269.233C507.749 268.771 508.104 268.3 508.431 267.808C508.585 267.578 508.715 267.338 508.859 267.103C509.075 266.75 509.296 266.4 509.491 266.034C509.652 265.734 509.787 265.424 509.932 265.118C510.082 264.801 510.241 264.489 510.376 264.164C510.521 263.814 510.639 263.457 510.764 263.102C510.868 262.807 510.983 262.517 511.074 262.216C511.201 261.798 511.298 261.375 511.399 260.952C511.458 260.704 511.53 260.461 511.581 260.21C511.698 259.629 511.78 259.044 511.848 258.457C511.86 258.356 511.881 258.258 511.891 258.156C512.036 256.722 512.036 255.276 511.891 253.842C511.881 253.74 511.859 253.642 511.848 253.541C511.78 252.954 511.697 252.369 511.581 251.788C511.531 251.537 511.459 251.294 511.399 251.046C511.298 250.623 511.201 250.199 511.074 249.782C510.983 249.481 510.868 249.191 510.764 248.896C510.638 248.541 510.521 248.183 510.376 247.834C510.241 247.509 510.083 247.197 509.932 246.88C509.787 246.574 509.652 246.265 509.491 245.964C509.295 245.598 509.075 245.248 508.859 244.895C508.715 244.66 508.585 244.42 508.431 244.19C508.104 243.698 507.749 243.227 507.383 242.765C507.32 242.685 507.266 242.601 507.201 242.521C506.721 241.932 506.21 241.37 505.67 240.836L420.416 155.582C412.075 147.241 398.592 147.241 390.251 155.582C381.91 163.923 381.91 177.406 390.251 185.747L439.168 234.664H256C244.203 234.664 234.667 244.221 234.667 255.997C234.667 267.773 244.203 277.33 256 277.33H439.168L390.251 326.247C381.91 334.588 381.91 348.071 390.251 356.412C394.411 360.572 399.872 362.663 405.334 362.663C410.795 362.663 416.257 360.572 420.417 356.412L505.671 271.158C506.209 270.628 506.72 270.066 507.201 269.477Z"
                                                        fill="url(#paint1_linear_117_53)" />
                                                    <defs>
                                                        <linearGradient id="paint0_linear_117_53" x1="0.333333" y1="252" x2="342.04" y2="255.334"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop style={{stopColor:"var(--color-principal)"}} /> {/* "#22DE04" */}
                                                            <stop offset="1" style={{stopColor:"var(--color-principal-hover)"}} /> {/* "#107100" */}
                                                        </linearGradient>
                                                        <linearGradient id="paint1_linear_117_53" x1="234.938" y1="254.328" x2="512.501" y2="259.608"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop style={{stopColor:"var(--color-principal)"}} /> {/* "#22DE04" */}
                                                            <stop offset="1" style={{stopColor:"var(--color-principal-hover)"}} /> {/* "#107100" */}
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                                                            </div>
                                        </div>
                                    </Navbar.Text></div>)
                            }
                            else
                            {
                                EtatConnexion.push(<Nav.Link><Link to="/login" style={{textDecoration: "none"}}>Se connecter</Link></Nav.Link>)
                            }

                            return EtatConnexion;
                        })()}

                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </>
        )
    }
}

export default Navigation;