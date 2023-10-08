import Controller from './Controller.js';
import fs from 'fs';
import path from 'path';

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
        console.log(helpPagePath);
        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
    }
    doOperation()
    {
        const operator = this.HttpContext.path.params.op;
        if (operator === undefined)
        {
            this.HttpContext.response.JSON({...this.HttpContext.path.params, error: "'op' parameter is missing"});
            return;
        }
        switch (operator)
        {
            // +
            case " ":
                this.HttpContext.path.params.op = "+"
                this.sendResponse((x, y) => x + y);
                break;

            case "-":
                this.sendResponse((x, y) => x - y);
                break;

            case "*":
                this.sendResponse((x, y) => x * y);
                break;

            case "/":
                this.sendResponse((x, y) => x / y);
                break;

            case "%":
                this.sendResponse((x, y) => x % y);
                break;

            case "!":
                this.sendResponse(this.factorial.bind(this));
                break;

            case "p":
                this.sendResponse(this.isPrime);
                break;

            case "np":
                this.sendResponse(this.nPrime.bind(this));
                break;

            default:
                this.HttpContext.response.JSON({...this.HttpContext.path.params, error: `'${operator}' operator is not supported'`});
                break;
        }
    }
    factorial(n)
    {
        if (!Number.isInteger(n)) return "'n' is not an integer";
        if (n <= 0) return "'n' parameter must be an integer > 0";
        return n <= 1 ? 1 : n * this.factorial(n - 1);
    }
    isPrime(n)
    {
        if (!Number.isInteger(n)) return "'n' is not an integer";
        if (n <= 0) return "'n' parameter must be an integer > 0";
        if (n === 1) return false;
        for (let i = 2; i < n; i++)
        {
            if (n % i === 0)
                return false;
        }
        return true;
    }
    nPrime(n)
    {
        let occurence = 0;
        const maxIteration = 100000;
        for (let i = 2; i < maxIteration; i++)
        {
            if (this.isPrime(i))
            {
                occurence++;
                if (occurence === n)
                    return i;
            }
        }
        return 'Max iteration reached';
    }

    requestError(expectedParamCount = 2)
    {
        const params = this.HttpContext.path.params;

        if (Object.keys(params).length - 1 > expectedParamCount)
            return "Too many parameters";
        
        if (expectedParamCount === 2)
        {
            if (params.x === undefined)
                return "'x' parameter is missing";
            if (params.y === undefined)
                return "'y' parameter is missing";

            if (Number(params.x) === NaN)
                return "'x' parameter is not a number";
            if (Number(params.y) === NaN)
                return "'y' parameter is not a number";
            return false;
        }
        else if (expectedParamCount === 1)
        {
            if (params.n === undefined)
                return "'n' parameter is missing";
            if (Number(params.n) === NaN)
                return "'n' parameter is not a number";
            return false;
        }
        else
            return false;
    }
    sendResponse(operation)
    {
        const params = this.HttpContext.path.params;
        let error = this.requestError(operation.length);
        if (error)
        {
            this.HttpContext.response.JSON({...params, error});
            return;
        }
        let value = operation.length === 2 ? operation(Number(params.x), Number(params.y)) : operation(Number(params.n));
        if (typeof value === "string")
            this.HttpContext.response.JSON({...params, error:value});
        else
        {
            if (value === Infinity || isNaN(value)) 
                value = String(value);
            this.HttpContext.response.JSON({...params, value});
        }
    }
}