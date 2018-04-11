var JsonBuilder = {};

JsonBuilder.buildImage = (image) => {
    return  {
        "id": image.id,
        "title": image.title,
        "url": image.originalimageurl,
        "description": image.description
    }
}

JsonBuilder.buildImageList = (images) => {
    var list = [];
    if(images) {
        images.forEach(img => list.push(JsonBuilder.buildImage(img)));
    }
    return list;
}

JsonBuilder.buildContent = (content) => {
    return {
        "id": content.id,
        "headline": content.headline,
        "summary": content.summary,
        "type": content.type,
        "url": content.url,
        "publishedAt": parseInt(content.epoch.pubdate),
        "updatedAt": parseInt(content.epoch.lastupdate),
        "body": content.body,
        "headlineImage": JsonBuilder.buildImage(content.headlineimage),
        "storyImages": JsonBuilder.buildImageList(content.storyimages)
    }
}

JsonBuilder.buildLineupItem = (item) => {
    return {
        "id": item.sourceId,
        "title": item.title,
        "description": item.description,
        "type": item.type,
        "url": item.typeAttributes.url,
        "publishedAt": item.publishedAt,
        "updatedAt": item.updatedAt,
        "headlineImage": {
            "url": item.typeAttributes.imageLarge
        }
    }
}

JsonBuilder.buildLineup = (items) => {
    var list = [];
    items.forEach(item => list.push(JsonBuilder.buildLineupItem(item)));
    return list;
}


module.exports = JsonBuilder;
