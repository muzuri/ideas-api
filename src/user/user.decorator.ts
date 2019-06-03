import { createParamDecorator } from "@nestjs/common";

// export const User = createParamDecorator(
//     (data: string,req, [root, args, ctx, info]) => {
//         return data ? ctx.user[data] : ctx.user;
//     }
// );

export const User = createParamDecorator((data: string, req) => {
 return data ? req.user[data] : req.user;
});

// export const User = createParamDecorator((req) => {
//     return req
//    });