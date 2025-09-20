const currency = "LKR";
let amount = null;
let plan = null;

async function payNow(amount, items) {

    const orderId = Date.now().toString();

    try {
        const res = await fetch(`http://localhost:8080/api/v1/payhere/generate-hash?orderId=${orderId}&amount=${amount}&currency=${currency}`, {
            method: "GET",
            credentials: "include"
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();

        const payment = {
            sandbox: true,
            merchant_id: data.merchant_id,
            return_url: "http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/home-page.html",
            cancel_url: "http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/home-page.html",
            notify_url: "http://localhost:8080/api/v1/payhere/notify",
            order_id: orderId,
            items: "Premium Subscription",
            amount: (amount / 100).toFixed(2),
            currency: currency,
            hash: data.hash,
            first_name: "Thenuri",
            last_name: "Nethangi",
            email: "thenurinathangi@gmail.com",
            phone: "+94714124926",
            address: "Dewinuwara",
            city: "Matara",
            country: "Sri Lanka"
        };

        payhere.startPayment(payment);
    } catch (error) {
        console.error("Error initiating payment:", error);
        Swal.fire({
            title: 'Fail',
            text: 'Failed to initiate payment! Please try again.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
        });
    }
}


payhere.onCompleted = function (orderId) {

    fetch('http://localhost:8080/api/v1/transaction/coins', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'amount': amount,
            'plan': plan
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(JSON.stringify(errData));
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);

            Swal.fire({
                title: 'Success',
                text: 'Successfully bought '+plan,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            Swal.fire({
                title: 'Fail',
                text: 'An error occur while purchasing the coins package, try later!',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        });
};


payhere.onDismissed = function () {
    // alert("Payment dismissed by user");
};


payhere.onError = function (error) {
    Swal.fire({
        title: 'Fail',
        text: 'An error occur while purchasing the coins package,try later!',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false
    });
};


// Attach click events to price buttons
document.querySelectorAll('.coin-package .price').forEach(button => {
    button.addEventListener('click', () => {
        const packageDiv = button.closest('.coin-package');
        const amount1 = parseInt(packageDiv.dataset.amount);
        const items = packageDiv.dataset.items;
        plan = items;
        amount = amount1;
        payNow(amount1, items);
    });
});