/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { formatDate } from '@/lib/utils'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface TreesInformationProps {
  trees: any[]
}

export const TreesInformation = ({ trees }: TreesInformationProps) => {
  if (!trees || trees.length === 0) return null

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Trees Information ({trees.length} trees)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map">
            <div className="h-[500px] rounded-lg overflow-hidden">
              <MapContainer
                center={[24.117619, 89.085839]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {trees.map((tree: any) => 
                  tree.lat && tree.lon && (
                    <Marker
                      key={tree.id}
                      position={[parseFloat(tree.lat), parseFloat(tree.lon)]}
                      // icon={defaultIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{tree.treeType.name}</h3>
                          <p className="text-sm">Added by: {tree.addBy.name}</p>
                          <p className="text-sm">Added on: {formatDate(tree.createdAt)}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )
                )}
              </MapContainer>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trees.map((tree: any) => (
                <div key={tree.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{tree.treeType.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Added by {tree.addBy.name} on {formatDate(tree.createdAt)}
                      </p>
                    </div>
                    {tree.replaced && (
                      <Badge variant="destructive">Replaced</Badge>
                    )}
                  </div>

                  {tree.images && tree.images.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Initial Images</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {tree.images.map((image: any, imgIndex: number) => (
                          <div key={imgIndex} className="relative aspect-square">
                            <Image
                              src={image.url}
                              alt={`Tree ${tree.id} image ${imgIndex + 1}`}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                      {tree.remarkOfImg && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Remark: {tree.remarkOfImg}
                        </p>
                      )}
                    </div>
                  )}

                  {tree.auditImages && tree.auditImages.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Audit Images</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {tree.auditImages.map((image: any, imgIndex: number) => (
                          <div key={imgIndex} className="relative aspect-square">
                            <Image
                              src={image.url}
                              alt={`Audit image ${imgIndex + 1}`}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                      {tree.auditRemarkImg && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Audit Remark: {tree.auditRemarkImg}
                        </p>
                      )}
                    </div>
                  )}

                  {tree.lat && tree.lon && (
                    <p className="text-sm">
                      Location: {tree.lat}, {tree.lon}
                    </p>
                  )}

                  {tree.replaced && (
                    <div className="text-sm text-muted-foreground">
                      <p>Replaced by: {tree.replacedBy?.name || 'Unknown'}</p>
                      <p>Replaced on: {formatDate(tree.replacedAt)}</p>
                      <p>Reason: {tree.replaceReason || 'Not specified'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
