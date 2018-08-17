import {Pipe,PipeTransform} from '@angular/core';

@Pipe({
    name: 'removeSpecialCharPipe' //our name
})

export class RemoveSpecialCharPipe implements PipeTransform{
    transform(value: string,charater: string){
        // we are taking a value as character from html parent component and replacing it with empty space
        return value.replace(charater, '');
    }
}