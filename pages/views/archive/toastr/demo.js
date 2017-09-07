// import './demo.scss';
import 'toastrcss';
import toastr from 'toastr';
// import _ from 'lodash';
// import Velocity from 'velocity';
// import axios from 'axios';

new Vue({
    el: '#example',
    data: {
        name: 'hello world!'
    }
})

toastr.options = {
    'closeButton': true,
    'debug': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
}

// Display a warning toast, with no title
toastr.warning('My name is Inigo Montoya. You killed my father, prepare to die!')

// Display a success toast, with a title
toastr.success('Have fun storming the castle!', 'Miracle Max Says')

// Display an error toast, with a title
toastr.error('I do not think that word means what you think it means.', 'Inconceivable!')

// // Immediately remove current toasts without using animation
// toastr.remove()
//
// // Remove current toasts using animation
// toastr.clear()

// // Override global options
// toastr.success('We do have the Kapua suite available.', 'Turtle Bay Resort', {
//     timeOut: 5000
// })
