jQuery(document).ready(function () {
    //
    $.validator.setDefaults({
        //Add an error class of invalid-feedback for error messages and make them display when there is an error
        errorClass: "invalid-feedback",
        highlight: function(element) {
            $(element).addClass("is-invalid");

            if($(element).attr("name") == "terms") {
                $.each($("input[name='terms']"), function(){ 
                    if($(this).hasClass("is-invalid") == false) {
                        $(this).addClass("is-invalid");
                    }
                });
            }
        },
        unhighlight: function(element) {
            $(element).removeClass("is-invalid");

            //Add the is-invalid class to the pay online checkbox if invalid because it doesnt do it automatically
            if($(element).attr("name") == "terms") {
                $.each($("input[name='terms']"), function(){    
                    if($(this).hasClass("is-invalid") == true) {
                        $(this).removeClass("is-invalid");
                    }
                });
            }
        },
        errorPlacement: function(error, element) {
            //Checks to see if its the element with #phone, #terms or the checkboxes with method_of_payment that's selected
            if((element).is("#terms"))
            {
                //Adds the eerror message after the element
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    var number_of_people_on_queue_exists;
    //My custom validation plugin method to validate phone numbers
    $.validator.addMethod("check_number_of_people_on_queue", function(value, element) {
        return this.optional(element)
        || (number_of_people_on_queue_exists != true)
    }, "Please the number of people on the queue must be lesser than or equal to the maximum number of people allowed on the queue");

    //Validate the form
    $("#myForm").validate({
        rules: {
            max_no_of_people: {
                required: true,
                minlength: 1,
                maxlength: 11,
                nowhitespace: true
            },
            no_of_people_on_the_queue: {
                required: true,
                minlength: 1,
                maxlength: 11
            },
            average_time_between_arrivals: {
                required: true,
                minlength: 1
            },
            average_time_per_service: {
                required: true,
                minlength: 1
            }
        },
        messages: {
            max_no_of_people: {
                required: "Please enter the maximum number of people expected on the queue",
                minlength: "It should be a minimum of 1 character",
                maxlength: "It should be a maximum of 1 character",
                nowhitespace: "Please there should be no space between characters"
            },
            no_of_people_on_the_queue: {
                required: "Please enter the current number of people on the queue",
                minlength: "Please it should be at least 1 character long",
                maxlength: "Please it should be at most 11 characters long"
            },
            average_time_between_arrivals: {
                required: "Please enter the average time between arrivals",
                minlength: "It should be a minimum of 1 character"
            },
            average_time_per_service: {
                required: "Please enter the time per service",
                minlength: "Please it should be a minimum of 1 character long"
            }
        },
        submitHandler: function(form, event) {
            //form.submit();
            event.preventDefault();

            var N = $("#max-no-of-people").val();
            var t1 = $("#average-time-between-arrivals").val();
            var t2 = $("#average-time-per-service").val();

            var lambda_in_minutes = 1/t1;
            var lambda_in_hours = 60/t1;

            var micro_in_minutes = 1/t2;
            var micro_in_hours = 60/t2;

            var p = lambda_in_minutes/micro_in_minutes;

            //Probability of it exceeding the maximum number of people expected on the queue
            var p_final = (Math.pow(p, (N + 1)) * (1 - p))/(1 - (Math.pow(p, (N + 1))))

            var percentage = Math.round(p_final * 100);
            console.log("N: " + N);
            console.log("t1: " + t1);
            console.log("t2: " + t2);
            console.log("lambda_in_minutes: " + lambda_in_minutes);
            console.log("micro_in_minutes: " + micro_in_minutes);
            console.log("Probability: " + p);
            console.log("Probability Final: " + p_final);

            $("#msg").text("");

            var arr;
            var arr_percentage;
            var text = "";

            for(var i = 0; i <= N; i++) {
                if(i == 0) {

                    var prob = ((1 - p)/(1 - (Math.pow(p, (N + 1)))));
                    var prob_percentage = Math.round(prob * 100);

                    text = text + `
                        <div>Probability of ${i} people on the queue: ${prob}, Percentage: ${prob_percentage}%</div>
                    `;
                } else {

                    var prob = (Math.pow(p, (i)) * (1 - p))/(1 - (Math.pow(p, i)));
                    var prob_percentage = Math.round(prob * 100);

                    text = text + `
                        <div>Probability of ${i} people on the queue: ${prob}, Percentage: ${prob_percentage}%</div>
                    `;
                }

            }

            if(percentage >= 75) {
                $("#msg").append(`
                    <div class='alert alert-danger'>
                        <div>Maximum number of people expected on the queue (N) = ${N}</div>
                        <div>Average time between arrivals, t1 = ${t1}</div>
                        <div>Average service time, t2 = ${t2}</div>
                        <div>Computations:</div>
                        <div>Average number of arrivals per minute: ${lambda_in_minutes}</div>
                        <div>Average number of arrivals per hour: ${lambda_in_hours}</div>
                        <div>Average number of units processed per minute for a continuously busy service facility: ${micro_in_minutes}</div>
                        <div>Average number of units processed per hour for a continuously busy service facility: ${micro_in_hours}</div>
                        ${text}
                        <div>
                            <strong>
                                At this rate, you need to add a new server now because the chances of the queue having
                                more than ${N} people is ${percentage}%
                            </strong>
                        </div>
                    </div>
                `);
            }

            if(percentage >= 50 && percentage < 75) {
                $("#msg").append(`
                    <div class='alert alert-warning'>
                        <div>Maximum number of people expected on the queue (N) = ${N}</div>
                        <div>Average time between arrivals, t1 = ${t1}</div>
                        <div>Average service time, t2 = ${t2}</div>
                        <div>Computations:</div>
                        <div>Average number of arrivals per minute: ${lambda_in_minutes}</div>
                        <div>Average number of arrivals per hour: ${lambda_in_hours}</div>
                        <div>Average number of units processed per minute for a continuously busy service facility: ${micro_in_minutes}</div>
                        <div>Average number of units processed per hour for a continuously busy service facility: ${micro_in_hours}</div>
                        ${text}
                        <div>
                            <strong>
                                At this rate, you will have to add a new server soon enough because the chances of the queue having
                                more than ${N} people is ${percentage}%
                            </strong>
                        </div>
                    </div>
                `);
            }
            
            if(percentage > 20 && percentage < 50) {
                $("#msg").append(`
                    <div class='alert alert-info'>
                        <div>Maximum number of people expected on the queue (N) = ${N}</div>
                        <div>Average time between arrivals, t1 = ${t1}</div>
                        <div>Average service time, t2 = ${t2}</div>
                        <div>Computations:</div>
                        <div>Average number of arrivals per minute: ${lambda_in_minutes}</div>
                        <div>Average number of arrivals per hour: ${lambda_in_hours}</div>
                        <div>Average number of units processed per minute for a continuously busy service facility: ${micro_in_minutes}</div>
                        <div>Average number of units processed per hour for a continuously busy service facility: ${micro_in_hours}</div>
                        ${text}
                        <div>
                            <strong>
                                At this rate, your current server will be enough for the queue because the chances of the queue having
                                more than ${N} people is ${percentage}%
                            </strong>
                        </div>
                    </div>
                `);
            }

            if(percentage <= 20) {
                $("#msg").append(`
                    <div class='alert alert-success'>
                        <div>Maximum number of people expected on the queue (N) = ${N}</div>
                        <div>Average time between arrivals, t1 = ${t1}</div>
                        <div>Average service time, t2 = ${t2}</div>
                        <div>Computations:</div>
                        <div>Average number of arrivals per minute: ${lambda_in_minutes}</div>
                        <div>Average number of arrivals per hour: ${lambda_in_hours}</div>
                        <div>Average number of units processed per minute for a continuously busy service facility: ${micro_in_minutes}</div>
                        <div>Average number of units processed per hour for a continuously busy service facility: ${micro_in_hours}</div>
                        ${text}
                        <div>
                            <strong>
                                At this rate, your queue will perform at it's best because the chances of the queue having
                                more than ${N} people is ${percentage}%
                            </strong>
                        </div>
                    </div>
                `);
            }
        }
    });
});