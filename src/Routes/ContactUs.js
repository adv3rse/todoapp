import {Outlet,Link} from 'react-router-dom'
function ContactUs() {
    return (
        <>
        <section className="jumbotron">
            <div className="container d-flex flex-column align-items-center">
                <h1 className="jumbotron-heading">Contact Us Page!</h1>
                <p className="lead text-muted">To get started, add some items to your list:</p>
            </div>
        </section>
        <Link to="/contact-us/form"> Click to See The Contact Form</Link><br/>
        <Link to="/contact-us/address"> Click to See The Contact Address</Link>
        <h1>
        <Outlet />
        </h1>
        </>
    )
}
export default ContactUs