import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, } from "react-router-dom";
import logo from '../assets/Logo/logo.png';

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const sendLink = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        
        if (email === "") {
            setError("Email is required!");
            return;
        } 
        if (!email.includes("@")) {
            setError("Please include @ in your email!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user/forgetpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (data.status === 201) {
                setEmail("");
                setMessage("Password reset link sent successfully!");
            } else {
                setError("Invalid User");
            }
        } catch(error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
                <div className="flex-1 mt-18">
                <Link to="/" className="text-5xl font-bold text-white">
                        <img
                            src={logo}
                            alt="MusicBible logo"
                            className="h-40 sm:h-28 md:h-40 lg:h-72 xl:h-96 w-auto mx-auto md:mx-0"
                        />
                    </Link>
                    <p className="text-sm font-cinzel font-gray font-semibold text-white"> Music expresses that which cannot be said and on which it is impossible to be silent. 
                        Music in itself is healing. It's an explosive expression of humanity. 
                        It's something we are all touched by. No matter what culture we're from, 
                        everyone loves music.</p>
                </div>
                <div className="flex-1 mt-24">
                    <p className="text-center text-2xl font-cinzel font-semibold text-white">Reset Password</p>
                    <form onSubmit={sendLink} className="flex flex-col gap-4 mt-5">
                        <div>
                            <Label className="text-white" value="Enter Your Email" />
                            <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange} value={email} />
                        </div>
                        <Button className="bg-amber-600" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Send Rest Link"}
                        </Button>
                    </form>
                    {message && <p className="text-green-600 mt-3">{message}</p>}
                    {error && <p className="text-red-600 mt-3">{error}</p>}
                    <div className="flex gap-2 text-sm mt-5 ">
                        <span className="text-white">Remembered your password?</span>
                        <Link to='/sign-in' className="text-blue-500">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
