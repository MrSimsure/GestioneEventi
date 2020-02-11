class Page
{
    constructor(dom, back)
    {
        this.html = dom;
        this.name = dom.getAttribute("id");
        this.backBtn = true;

        if(back != undefined)
            this.backBtn = back;
    }


    delete()
    {
        $( this.html ).remove();
    }
}