const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');
code = code.replace(
  `  rt_number: text('rt_number').notNull(),
});`,
  `  rt_number: text('rt_number').notNull(),
  reset_token: text('reset_token'),
  reset_token_expires: timestamp('reset_token_expires'),
});`
);
fs.writeFileSync('src/db/schema.ts', code);
console.log('Schema updated');
