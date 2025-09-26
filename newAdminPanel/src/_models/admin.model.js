export const adminModel = {
    createdDate: Date,
    updatedDate: Date,
    id: {
        type: String,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    mobile: {
        type: Number
    },
    password: {
        type: String
    },
    permissions: {
        type: [
            {
                pageId: {
                    type: String
                },
                actions: [
                    {
                        actionId: {
                            type: String,
                        }
                    }
                ]
            }
        ],
    }
};
