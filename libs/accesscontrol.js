const AccessControl = require('accesscontrol');

const grants = {
    student: {
        task: {
            "read:own": [ "*" ],
            "update:own": [ "progress" ],
        }
    },
    admin: {
      task: {
        "read:any": [ "*" ],
        "update:any": [ "*" ],
        "create:any": [ "*" ],
        "delete:any": [ "*" ],
      }
    }
};

const ac = new AccessControl(grants);

module.exports = ac;
