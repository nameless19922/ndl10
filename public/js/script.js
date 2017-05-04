(function () {
    var store = {
        state: {
            contacts: []
        },

        getContacts: function (contacts) {
            this.state.contacts = contacts.slice();
        },

        removeContact: function (id) {
            this.state.contacts = this.state.contacts.filter(function (item) {
                return item._id !== id;
            });
        }
    };

    new Vue({
        el: '#app',

        data: function () {
            return {
                shared: store.state,

                contact: {
                    firstname: '',
                    lastname: '',
                    phone: ''
                },

                message: {
                    type: '',
                    text: ''
                },

                search: {
                    input: '',
                    select: '0'
                }
            }
        },

        methods: {
            getAll: function () {
                this.$http.get('/api/v1/contacts', {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(function (response) {
                    store.getContacts(response.data.response.contacts);
                });
            },

            add: function () {
                var contact = this.contact;

                this.$http.post('/api/v1/contacts', this.contact).then(function (response) {
                    if (!response.data.response.status) {
                        this.message.text = response.data.response.errors.replace(/[\r\n]+/g,'<br>');
                        this.message.type = '_error';
                    } else {
                        this.message.text = 'Contact successfully created';
                        this.message.type = '_success';

                        Object.keys(contact).forEach(function (key) {
                            contact[key] = '';
                        });
                    }
                });
            },

            remove: function (id) {
                this.$http.delete('/api/v1/contacts/' + id).then(function (response) {
                    if (response.data.response.status) {
                        store.removeContact(id);
                    }
                });
            }
        },

        mounted: function () {
            this.getAll();
        }
    });
}());