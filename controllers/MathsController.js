import Controller from './Controller.js';
import fs from 'fs';

export default class MathsController extends Controller
{
    constructor(HttpContext, repository)
    {
        super(HttpContext, repository);
        const i = 0;
    }
    get()
    {
        if (this.HttpContext.path.queryString == "?" || this.HttpContext.path.queryString == "")
            this.help();
        else
            this.doOperation();
    }
    help()
    {
        let helpPagePath = path.join(process.cwd(), wwwroot, 'API-Help-Pages/API-Maths-Help.html');
        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
    }
    doOperation()
    {
        this.HttpContext.response.JSON(this.HttpContext.path.params);
    }
}