let tableHTML = '<table class="table">';
const randomUserApi = 'https://randomuser.me/api/?results=12&nat=us';
let matches = [];  
let users = [];
const noResults = "<h1 class='noResults'>No such a employee in the directory.</h1>"

/*FUNCTIONS -------------------------------------------------------------------------------------------------------- */

function displayUser(user, index) { //function that displays a single user
    let counter = 0;
    while (counter % 3 === 1 ) {
        tableHTML += '<tr>';
        let modal;
    } //while
    tableHTML += '<th class="'+ index+'">';
    tableHTML += '<img class="pp" src="' + user.picture.large + '" alt="profile">';
    tableHTML += '<div class="info">';
    tableHTML += '<div class="name">' + user.name.first + ' ' + user.name.last + '</div>';
    tableHTML += '<div class="email">' + user.email + '</div>';
    tableHTML += '<div class="city">' + user.location.city + ', ' + user.location.state +'</div>';
    tableHTML += '</div></th>';
    if(index % 3 === 2) {
        tableHTML += '</tr>';
        counter ++;
    } //if
    return tableHTML;
}
function filter(data, searchVal) { // checks if any of the employees name or username matches the search input value
    matches = [];
    $.each(data.results, function(index, item) {
        if(item.name.first.indexOf(searchVal) === 0 || item.login.username.indexOf(searchVal) === 0 ) {
            if($.inArray(item, matches) != 1) {
                matches.push(item); 
                displayUser(item, index);        
            } 
        }
        if(matches.length === 0) {
            $('#users').html(noResults); 
        } else {
            $('#users').html(tableHTML);
        }  
    });
}

function display(data) { //function that displays three users in one row, and it's a callback func for the ajax request
    $.each(data.results, function(index, item) {        
        displayUser(item, index);  
        users[index] = data.results[index];
    }); // each
    $('#search').on('keyup', (e) => {
        let target = $(e.target);
        let searchVal = target.val();
        if(searchVal != ''){
            tableHTML = '';
        }
        tableHTML = '<table class="table">';
        filter(data, searchVal);
    });    
    tableHTML += '</table>';
    $('#users').html(tableHTML);
    return users;
} // display

function displayModal(modal) { //function that displays the modal div and populates it with the info for the user provided as an argument.
    $('.modal').css('display', 'block');
    $('.arrows').css('display', 'block');
    let modalHTML = '<img class="modalPhoto" src="' + modal.picture.large + '" alt="profile">';
    modalHTML += '<div id="del">' + '&#x2612;' +'</div>';
    modalHTML += '<div class="modalName">' + modal.name.first + '</div>';
    modalHTML += '<div class="modalEmail">' + modal.email + '</div>';
    modalHTML += '<div class="userName">' + modal.login.username + '</div>';
    modalHTML += '<div class="cellNumber">' + modal.cell + '</div>';
    modalHTML += '<div class="address">' + modal.location.street + ', ' + modal.location.city + ', ' + modal.location.state + ', ' + modal.location.postcode + '</div>';
    modalHTML += '<div class="dob">Date of Birth: ' + modal.dob + '</div>';
    $('.modal').html(modalHTML);
}
function closeModal() { // function that closes the modal window
    $('.modal').css('display', 'none');  //clear the grey background
    $('.arrows').css('display', 'none');
    $('.over').css('display', 'none'); //and clear the modal window
} //function that closes the modal window

/*EVENTS ------------------------------------------------------------------------------------------------------------ */

$('#users').on('click', function(e) { //when click on a user , displayModal function is called with the argument of target's id
    let target = $(e.target);
    if(target.is('th')) {
        let modal = users[target.attr('class')];
        displayModal(modal);
        $('.over').css('display', 'block'); //display a grey background over the content and below the modal window
        let indx = parseInt(target.attr('class'));
        $('.right').click( function(e) { // if right arrow is clicked the next employee is displayed
            indx ++;
            if(indx <= 11) {
                displayModal(users[indx]);                    
            }else {
                indx --;
            }            
        });
        $('.left').click( function(e) { // if left arrow is clicked the prev employee is displayed
            indx --;
            if(indx >= 0) {
                displayModal(users[indx]);                    
            } else {
                indx ++;
            }            
        });
        $(document).keyup(function(e) {  //when press left or right arrow button, show the next or prev modal window
            if (e.which == 39) {
                indx ++;
                if(indx <= 11) {
                    displayModal(users[indx]);                    
                } else {
                    indx --;
                }            
            } else if(e.which == 37) { 
                indx --;
                if(indx >= 0) {
                    displayModal(users[indx]);   
                } else {
                    indx ++;
                }
            }
        }); 
    }
});
$(document).keyup(function(e) {  //when press ECS button, the modal window is closed
    if (e.which == 27) {
        closeModal();
    }
});
$('.modal').on('click', function(e) { //when the close icon is clicked the modal window is closed
    let target = $(e.target);
    if(target.attr('id') === 'del') {
        closeModal();
    }
});

/*getJSON AJAX request */
$.getJSON(randomUserApi, display);