(function () {
    var store = {
        state: {
            contacts: []
        },

        addContacts: function (contacts) {
            this.state.contacts = contacts.slice();
        },

        removeContact: function (id) {
            this.state.contacts = this.state.contacts.filter(function (item) {
                return item._id !== id;
            });
        }
    };

    Vue.directive('init', {
        bind: function(el, binding, vnode) {
            vnode.context['contact'][binding.arg] = binding.value;
        }
    });

    var vm = new Vue({
        el: '#app',

        data: function () {
            return {
                shared: store.state,

                contact: {
                    firstname:  '',
                    lastname:   '',
                    phone:      '',
                    additional: ''
                },

                message: {
                    type: '',
                    text: ''
                },

                search: {
                    query:  '',
                    field:  'firstname'
                }
            }
        },

        methods: {
            getAll: function () {
                this.$http.get('/api/v1/contacts', { params: this.search }, {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(function (response) {
                    var result = response.data.response.contacts,
                        search  = this.search;

                    if (search.query.length) {
                        result = result.map(function (item) {
                            var field = search.field;

                            item[field] = item[field].replace(
                                new RegExp('(' + search.query + ')', 'gi'),
                                '<b>$1</b>'
                            );

                            return item;
                        });
                    }

                    store.addContacts(result);
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

            update: function (id) {
                var contact = this.contact;

                this.$http.put('/api/v1/contacts/' + id, this.contact).then(function (response) {
                    if (!response.data.response.status) {
                        this.message.text = response.data.response.errors.replace(/[\r\n]+/g,'<br>');
                        this.message.type = '_error';
                    } else {
                        this.message.text = 'Contact successfully updated';
                        this.message.type = '_success';
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